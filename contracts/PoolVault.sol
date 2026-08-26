// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title PoolVault
 * @notice Per-user vault that holds multiple savings pools backed by an ERC-20 token (USDT).
 */
contract PoolVault {
    using SafeERC20 for IERC20;

    // ── Enums ──────────────────────────────────────────────
    enum PoolType { SAVINGS, INVESTMENT, CHARITY, EMERGENCY, CUSTOM }
    enum Restriction { NONE, REASON_REQUIRED, PROOF_REQUIRED, REASON_AND_PROOF }

    // ── Structs ────────────────────────────────────────────
    struct Pool {
        uint256 id;
        string name;
        PoolType poolType;
        uint256 balance;
        uint256 allocationPercentage; // bps (100 = 1%)
        Restriction restriction;
        bool requiresReason;
        bool requiresProof;
        uint256 cooldownDays;
        uint256 parentId; // 0 = top-level
    }

    struct Vault {
        bool exists;
        uint256 nextPoolId;
    }

    // ── State ──────────────────────────────────────────────
    IERC20 public immutable token;
    mapping(address => Vault) public vaults;
    mapping(address => uint256[]) private _vaultPoolIds;
    mapping(address => mapping(uint256 => Pool)) public pools;

    // ── Events ─────────────────────────────────────────────
    event VaultCreated(address indexed owner);
    event PoolCreated(address indexed vaultOwner, uint256 indexed poolId, string name, PoolType poolType);
    event Deposited(address indexed vaultOwner, uint256 indexed poolId, uint256 amount);
    event Withdrawn(address indexed vaultOwner, uint256 indexed poolId, uint256 amount, string reason);

    // ── Errors ─────────────────────────────────────────────
    error VaultAlreadyExists();
    error VaultNotFound();
    error PoolNotFound();
    error InsufficientBalance(uint256 requested, uint256 available);
    error Unauthorized();

    // ── Constructor ────────────────────────────────────────
    constructor(address _token) {
        token = IERC20(_token);
    }

    // ── Modifiers ──────────────────────────────────────────
    modifier onlyVaultOwner() {
        if (!vaults[msg.sender].exists) revert VaultNotFound();
        _;
    }

    // ── Core Functions ─────────────────────────────────────

    function createVault() external {
        if (vaults[msg.sender].exists) revert VaultAlreadyExists();
        vaults[msg.sender] = Vault({exists: true, nextPoolId: 1});
        emit VaultCreated(msg.sender);
    }

    function createPool(
        string calldata name,
        PoolType poolType,
        uint256 allocationPercentage,
        Restriction restriction,
        bool requiresReason,
        bool requiresProof,
        uint256 cooldownDays,
        uint256 parentId
    ) external onlyVaultOwner returns (uint256) {
        uint256 poolId = vaults[msg.sender].nextPoolId;

        pools[msg.sender][poolId] = Pool({
            id: poolId,
            name: name,
            poolType: poolType,
            balance: 0,
            allocationPercentage: allocationPercentage,
            restriction: restriction,
            requiresReason: requiresReason,
            requiresProof: requiresProof,
            cooldownDays: cooldownDays,
            parentId: parentId
        });

        _vaultPoolIds[msg.sender].push(poolId);
        vaults[msg.sender].nextPoolId = poolId + 1;

        emit PoolCreated(msg.sender, poolId, name, poolType);
        return poolId;
    }

    function deposit(uint256 poolId, uint256 amount) external onlyVaultOwner {
        if (pools[msg.sender][poolId].id == 0 && poolId != 0) revert PoolNotFound();

        token.safeTransferFrom(msg.sender, address(this), amount);
        pools[msg.sender][poolId].balance += amount;

        emit Deposited(msg.sender, poolId, amount);
    }

    function withdraw(uint256 poolId, uint256 amount, string calldata reason) external onlyVaultOwner {
        Pool storage pool = pools[msg.sender][poolId];
        if (pool.id == 0 && poolId != 0) revert PoolNotFound();
        if (pool.balance < amount) {
            revert InsufficientBalance(amount, pool.balance);
        }

        pool.balance -= amount;
        token.safeTransfer(msg.sender, amount);

        emit Withdrawn(msg.sender, poolId, amount, reason);
    }

    // ── Views ──────────────────────────────────────────────

    function getPoolBalance(uint256 poolId) external view onlyVaultOwner returns (uint256) {
        return pools[msg.sender][poolId].balance;
    }

    function getAllPools() external view onlyVaultOwner returns (uint256[] memory) {
        return _vaultPoolIds[msg.sender];
    }

    function getPoolCount() external view onlyVaultOwner returns (uint256) {
        return _vaultPoolIds[msg.sender].length;
    }

    function getPool(uint256 poolId) external view onlyVaultOwner returns (Pool memory) {
        return pools[msg.sender][poolId];
    }

    function getPoolRestriction(address vaultOwner, uint256 poolId) external view returns (Restriction, bool, bool, uint256) {
        Pool storage pool = pools[vaultOwner][poolId];
        return (pool.restriction, pool.requiresReason, pool.requiresProof, pool.cooldownDays);
    }
}
