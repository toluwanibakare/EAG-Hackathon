const hre = require("hardhat");

/**
 * Helper script to test the full allocation flow locally.
 *
 * Usage:
 *   npx hardhat run scripts/allocate.cjs --network localhost
 */

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Using account:", deployer.address);

  // ── Addresses — update after deploying ──
  const ADDRESSES = {
    usdt: process.env.USDT_ADDRESS || "",
    vault: process.env.VAULT_ADDRESS || "",
    policy: process.env.POLICY_ADDRESS || "",
    engine: process.env.ENGINE_ADDRESS || "",
  };

  // Validate
  for (const [key, val] of Object.entries(ADDRESSES)) {
    if (!val) {
      console.error(`Missing ${key} address. Set ${key.toUpperCase()}_ADDRESS env or update the script.`);
      process.exit(1);
    }
  }

  const usdt = await hre.ethers.getContractAt("USDTMock", ADDRESSES.usdt);
  const vault = await hre.ethers.getContractAt("PoolVault", ADDRESSES.vault);
  const policy = await hre.ethers.getContractAt("PolicyModule", ADDRESSES.policy);
  const engine = await hre.ethers.getContractAt("AllocationEngine", ADDRESSES.engine);

  // ── Step 1: Create vault ──
  console.log("\n1. Creating vault...");
  try {
    const tx1 = await vault.createVault();
    await tx1.wait();
    console.log("   Vault created for", deployer.address);
  } catch (e) {
    if (e.message.includes("VaultAlreadyExists")) {
      console.log("   Vault already exists, skipping.");
    } else {
      throw e;
    }
  }

  // ── Step 2: Create pools ──
  console.log("\n2. Creating pools...");

  const PoolType = { SAVINGS: 0, INVESTMENT: 1, CHARITY: 2, EMERGENCY: 3, CUSTOM: 4 };
  const Restriction = { NONE: 0, REASON_REQUIRED: 1, PROOF_REQUIRED: 2, REASON_AND_PROOF: 3 };

  const poolConfigs = [
    { name: "Savings",      type: PoolType.SAVINGS,     pct: 4000, restriction: Restriction.NONE,                 cooldown: 0 },
    { name: "Investments",  type: PoolType.INVESTMENT,  pct: 2500, restriction: Restriction.REASON_REQUIRED,      cooldown: 30 },
    { name: "Tithe",        type: PoolType.CHARITY,     pct: 1000, restriction: Restriction.NONE,                 cooldown: 0 },
    { name: "Emergency",    type: PoolType.EMERGENCY,   pct: 1500, restriction: Restriction.REASON_AND_PROOF,     cooldown: 7 },
    { name: "Vacation",     type: PoolType.CUSTOM,      pct: 1000, restriction: Restriction.REASON_REQUIRED,      cooldown: 14 },
  ];

  const poolIds = [];
  for (const cfg of poolConfigs) {
    try {
      const tx = await vault.createPool(
        cfg.name,
        cfg.type,
        cfg.pct,
        cfg.restriction,
        cfg.restriction >= 1,
        cfg.restriction >= 2,
        cfg.cooldown,
        0
      );
      const receipt = await tx.wait();
      const event = receipt.logs.find((log) => {
        try {
          return vault.interface.parseLog(log)?.name === "PoolCreated";
        } catch { return false; }
      });
      const parsed = vault.interface.parseLog(event);
      const poolId = parsed.args.poolId;
      poolIds.push(poolId);
      console.log(`   Pool "${cfg.name}" created with id ${poolId}`);
    } catch (e) {
      if (e.message.includes("reverted")) {
        console.log(`   Pool "${cfg.name}" may already exist, skipping.`);
      } else {
        throw e;
      }
    }
  }

  // ── Step 3: Create policy ──
  console.log("\n3. Creating allocation policy...");
  const policyPoolIds = poolIds.length > 0 ? poolIds : [1, 2, 3, 4, 5];
  const policyPcts = [4000, 2500, 1000, 1500, 1000];

  let policyId;
  try {
    const tx3 = await policy.createPolicy(
      "Default Split",
      true,
      "salary",
      policyPoolIds,
      policyPcts,
      deployer.address
    );
    const receipt3 = await tx3.wait();
    const event3 = receipt3.logs.find((log) => {
      try {
        return policy.interface.parseLog(log)?.name === "PolicyCreated";
      } catch { return false; }
    });
    const parsed3 = policy.interface.parseLog(event3);
    policyId = parsed3.args.policyId;
    console.log(`   Policy created with id ${policyId}`);
  } catch (e) {
    if (e.message.includes("reverted")) {
      console.log("   Policy may already exist, reading default...");
      policyId = await policy.getDefaultPolicy(deployer.address);
    } else {
      throw e;
    }
  }

  // ── Step 4: Mint USDT and allocate ──
  const incomeAmount = hre.ethers.parseEther("1000"); // 1000 USDT
  console.log(`\n4. Minting ${hre.ethers.formatEther(incomeAmount)} USDT to deployer...`);
  const txMint = await usdt.mint(deployer.address, incomeAmount);
  await txMint.wait();

  console.log("   Approving AllocationEngine...");
  const txApprove = await usdt.approve(ADDRESSES.engine, incomeAmount);
  await txApprove.wait();

  console.log("   Allocating income...");
  const txAlloc = await engine.allocateIncome(deployer.address, policyId, incomeAmount);
  const receiptAlloc = await txAlloc.wait();
  console.log("   Done! Tx:", receiptAlloc.hash);

  // ── Step 5: Check balances ──
  console.log("\n5. Pool balances after allocation:");
  const allPoolIds = await vault.getAllPools();
  for (const id of allPoolIds) {
    const pool = await vault.getPool(id);
    const bal = await vault.getPoolBalance(id);
    console.log(`   Pool ${id} "${pool.name}": ${hre.ethers.formatEther(bal)} USDT`);
  }

  const remaining = await usdt.balanceOf(deployer.address);
  console.log(`\n   Deployer remaining USDT: ${hre.ethers.formatEther(remaining)}`);
  console.log("\n=== Allocation test complete! ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
