// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title PolicyModule
 * @notice Stores allocation policies that define how income is split across pools.
 */
contract PolicyModule {
    // ── Structs ────────────────────────────────────────────
    struct Allocation {
        uint256 poolId;
        uint256 percentage; // basis points (100 = 1%, max 10000)
    }

    struct Policy {
        uint256 id;
        string name;
        bool isDefault;
        string incomeSource;
        Allocation[] allocations;
    }

    // ── State ──────────────────────────────────────────────
    uint256 public nextPolicyId;
    mapping(uint256 => Policy) public policies;
    mapping(address => uint256) public userDefaultPolicy; // user => policyId

    // ── Events ─────────────────────────────────────────────
    event PolicyCreated(uint256 indexed policyId, string name, bool isDefault);
    event PolicyUpdated(uint256 indexed policyId);
    event PolicyApplied(uint256 indexed policyId, uint256 incomeAmount);

    // ── Errors ─────────────────────────────────────────────
    error PercentagesDoNotSumTo100();
    error PolicyNotFound();
    error InvalidPoolId();

    // ── Constructor ────────────────────────────────────────
    constructor() {
        nextPolicyId = 1;
    }

    // ── Core Functions ─────────────────────────────────────

    function createPolicy(
        string calldata name,
        bool isDefault,
        string calldata incomeSource,
        uint256[] calldata poolIds,
        uint256[] calldata percentages,
        address user
    ) external returns (uint256) {
        if (poolIds.length != percentages.length) revert PercentagesDoNotSumTo100();

        uint256 totalBps;
        for (uint256 i = 0; i < percentages.length; i++) {
            totalBps += percentages[i];
            if (poolIds[i] == 0) revert InvalidPoolId();
        }
        if (totalBps != 10000) revert PercentagesDoNotSumTo100();

        uint256 policyId = nextPolicyId;
        Policy storage p = policies[policyId];
        p.id = policyId;
        p.name = name;
        p.isDefault = isDefault;
        p.incomeSource = incomeSource;

        for (uint256 i = 0; i < poolIds.length; i++) {
            p.allocations.push(Allocation({poolId: poolIds[i], percentage: percentages[i]}));
        }

        if (isDefault) {
            userDefaultPolicy[user] = policyId;
        }

        nextPolicyId++;
        emit PolicyCreated(policyId, name, isDefault);
        return policyId;
    }

    function updatePolicy(
        uint256 policyId,
        string calldata name,
        string calldata incomeSource,
        uint256[] calldata poolIds,
        uint256[] calldata percentages
    ) external {
        Policy storage p = policies[policyId];
        if (p.id == 0) revert PolicyNotFound();
        if (poolIds.length != percentages.length) revert PercentagesDoNotSumTo100();

        uint256 totalBps;
        for (uint256 i = 0; i < percentages.length; i++) {
            totalBps += percentages[i];
        }
        if (totalBps != 10000) revert PercentagesDoNotSumTo100();

        delete p.allocations;
        p.name = name;
        p.incomeSource = incomeSource;

        for (uint256 i = 0; i < poolIds.length; i++) {
            p.allocations.push(Allocation({poolId: poolIds[i], percentage: percentages[i]}));
        }

        emit PolicyUpdated(policyId);
    }

    // ── Views ──────────────────────────────────────────────

    function getDefaultPolicy(address user) external view returns (uint256) {
        return userDefaultPolicy[user];
    }

    function applyPolicy(uint256 policyId, uint256 incomeAmount)
        external
        view
        returns (uint256[] memory poolIds, uint256[] memory amounts)
    {
        Policy storage p = policies[policyId];
        if (p.id == 0) revert PolicyNotFound();

        uint256 len = p.allocations.length;
        poolIds = new uint256[](len);
        amounts = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            poolIds[i] = p.allocations[i].poolId;
            amounts[i] = (incomeAmount * p.allocations[i].percentage) / 10000;
        }
    }

    function getPolicy(uint256 policyId) external view returns (Policy memory) {
        return policies[policyId];
    }

    function getPolicyAllocationCount(uint256 policyId) external view returns (uint256) {
        return policies[policyId].allocations.length;
    }
}
