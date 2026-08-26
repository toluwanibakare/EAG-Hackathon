// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "./PoolVault.sol";
import "./PolicyModule.sol";

/**
 * @title AllocationEngine
 * @notice Orchestrates income splitting: takes income, applies a policy, and deposits into pools.
 */
contract AllocationEngine {
    using SafeERC20 for IERC20;

    // ── State ──────────────────────────────────────────────
    PoolVault public immutable poolVault;
    PolicyModule public immutable policyModule;
    IERC20 public immutable token;

    // Cooldown tracking: user => poolId => last withdraw timestamp
    mapping(address => mapping(uint256 => uint256)) public lastWithdrawTime;

    // ── Events ─────────────────────────────────────────────
    event IncomeAllocated(
        address indexed vaultOwner,
        uint256 indexed policyId,
        uint256 incomeAmount,
        uint256[] poolIds,
        uint256[] amounts
    );
    event RestrictionChecked(
        address indexed vaultOwner,
        uint256 indexed poolId,
        bool allowed,
        string reason
    );

    // ── Errors ─────────────────────────────────────────────
    error TransferFailed();
    error RestrictionViolation(string reason);
    error CooldownActive(uint256 remainingSeconds);

    // ── Constructor ────────────────────────────────────────
    constructor(address _poolVault, address _policyModule, address _token) {
        poolVault = PoolVault(_poolVault);
        policyModule = PolicyModule(_policyModule);
        token = IERC20(_token);
    }

    // ── Core Functions ─────────────────────────────────────

    /**
     * @notice Splits `incomeAmount` across pools per the given policy and deposits into the vault.
     * @dev Caller must have approved this contract for `incomeAmount`.
     */
    function allocateIncome(
        address vaultOwner,
        uint256 policyId,
        uint256 incomeAmount
    ) external returns (uint256[] memory poolIds, uint256[] memory amounts) {
        // Transfer income from caller
        token.safeTransferFrom(msg.sender, address(this), incomeAmount);

        // Get allocation from policy
        (poolIds, amounts) = policyModule.applyPolicy(policyId, incomeAmount);

        // Forward each allocation to the pool vault
        for (uint256 i = 0; i < poolIds.length; i++) {
            if (amounts[i] > 0) {
                token.forceApprove(address(poolVault), amounts[i]);
                poolVault.deposit(poolIds[i], amounts[i]);
            }
        }

        emit IncomeAllocated(vaultOwner, policyId, incomeAmount, poolIds, amounts);
    }

    /**
     * @notice Checks if a withdrawal is allowed based on the pool's restriction settings.
     */
    function enforceRestriction(
        address vaultOwner,
        uint256 poolId,
        uint256, /* amount */
        string calldata reason,
        bool hasProof
    ) external returns (bool) {
        (PoolVault.Restriction restriction, , , uint256 cooldownDays) =
            poolVault.getPoolRestriction(vaultOwner, poolId);

        bool allowed = true;
        string memory violationReason = "";

        if (restriction == PoolVault.Restriction.REASON_REQUIRED ||
            restriction == PoolVault.Restriction.REASON_AND_PROOF) {
            if (bytes(reason).length == 0) {
                allowed = false;
                violationReason = "Reason is required for this pool";
            }
        }

        if (allowed && (restriction == PoolVault.Restriction.PROOF_REQUIRED ||
            restriction == PoolVault.Restriction.REASON_AND_PROOF)) {
            if (!hasProof) {
                allowed = false;
                violationReason = "Proof is required for this pool";
            }
        }

        if (allowed && cooldownDays > 0) {
            uint256 cooldownRemaining = checkCooldown(vaultOwner, poolId, cooldownDays);
            if (cooldownRemaining > 0) {
                allowed = false;
                violationReason = "Cooldown active";
            }
        }

        emit RestrictionChecked(vaultOwner, poolId, allowed, violationReason);

        if (!allowed) {
            revert RestrictionViolation(violationReason);
        }

        return true;
    }

    /**
     * @notice Returns remaining cooldown time in seconds for a pool.
     */
    function checkCooldown(
        address vaultOwner,
        uint256 poolId,
        uint256 cooldownDays
    ) public view returns (uint256) {
        uint256 lastTime = lastWithdrawTime[vaultOwner][poolId];
        if (lastTime == 0) return 0;

        uint256 cooldownEnd = lastTime + (cooldownDays * 1 days);
        if (block.timestamp >= cooldownEnd) return 0;

        return cooldownEnd - block.timestamp;
    }

    /**
     * @notice Records a withdrawal timestamp for cooldown tracking.
     */
    function recordWithdrawal(address vaultOwner, uint256 poolId) external {
        lastWithdrawTime[vaultOwner][poolId] = block.timestamp;
    }
}
