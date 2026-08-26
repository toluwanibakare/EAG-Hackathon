const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);
  console.log("Balance:", hre.ethers.formatEther(await hre.ethers.provider.getBalance(deployer.address)), "ETH");

  // 1. Deploy USDTMock (for local/testnet)
  console.log("\n--- Deploying USDTMock ---");
  const USDTMock = await hre.ethers.getContractFactory("USDTMock");
  const usdt = await USDTMock.deploy();
  await usdt.waitForDeployment();
  const usdtAddr = await usdt.getAddress();
  console.log("USDTMock deployed to:", usdtAddr);

  // 2. Deploy PoolVault
  console.log("\n--- Deploying PoolVault ---");
  const PoolVault = await hre.ethers.getContractFactory("PoolVault");
  const vault = await PoolVault.deploy(usdtAddr);
  await vault.waitForDeployment();
  const vaultAddr = await vault.getAddress();
  console.log("PoolVault deployed to:", vaultAddr);

  // 3. Deploy PolicyModule
  console.log("\n--- Deploying PolicyModule ---");
  const PolicyModule = await hre.ethers.getContractFactory("PolicyModule");
  const policy = await PolicyModule.deploy();
  await policy.waitForDeployment();
  const policyAddr = await policy.getAddress();
  console.log("PolicyModule deployed to:", policyAddr);

  // 4. Deploy AllocationEngine
  console.log("\n--- Deploying AllocationEngine ---");
  const AllocationEngine = await hre.ethers.getContractFactory("AllocationEngine");
  const engine = await AllocationEngine.deploy(vaultAddr, policyAddr, usdtAddr);
  await engine.waitForDeployment();
  const engineAddr = await engine.getAddress();
  console.log("AllocationEngine deployed to:", engineAddr);

  // Print summary
  console.log("\n========================================");
  console.log("  RUNDA — Deployment Summary");
  console.log("========================================");
  console.log(`  USDTMock:         ${usdtAddr}`);
  console.log(`  PoolVault:        ${vaultAddr}`);
  console.log(`  PolicyModule:     ${policyAddr}`);
  console.log(`  AllocationEngine: ${engineAddr}`);
  console.log("========================================\n");

  // Optional: Verify on Blockscout
  const network = hre.network.name;
  if (network !== "hardhat" && network !== "localhost") {
    console.log("Waiting for block confirmations before verification...");
    await new Promise((r) => setTimeout(r, 30000));

    for (const [name, contract] of [
      ["USDTMock", usdt],
      ["PoolVault", vault],
      ["PolicyModule", policy],
      ["AllocationEngine", engine],
    ]) {
      try {
        const address = await contract.getAddress();
        const args = name === "PoolVault" ? [usdtAddr] :
                     name === "AllocationEngine" ? [vaultAddr, policyAddr, usdtAddr] :
                     [];
        await hre.run("verify:verify", {
          address,
          constructorArguments: args,
        });
        console.log(`${name} verified!`);
      } catch (e) {
        console.log(`${name} verification failed:`, e.message);
      }
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
