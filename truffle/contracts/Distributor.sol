// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24;

import "./Agents.sol";
import "./Owner.sol";

contract Distributor is Owner{
    using Agents for Agents.Role;

    event DistributorAdded(address indexed account);
    event DistributorRemoved(address indexed account);
    event DistributorReported(address indexed account);
    event DistributorUnreported(address indexed account);

    Agents.Role private distributors;

    modifier onlyDistributor(address account) {
        require(isDistributor(account));
        _;
    }

    function isDistributor(address account) public view returns (bool) {
        return distributors.has(account);
    }

    function addDistributor(address account) onlyOwner public {
        _addDistributor(account);
    }

    function reportDistributor(address account) public {
        _reportDistributor(account);
    }

    function unreportDistributor(address account) public {
        _unreportDistributor(account);
    }

    function renounceDistributor(address account) onlyOwner internal {
        _removeDistributor(account);
    }

    function _addDistributor(address account) internal {
        distributors.add(account);
        emit DistributorAdded(account);
    }

    function _removeDistributor(address account) internal {
        distributors.remove(account);
        emit DistributorRemoved(account);
    }

    function _reportDistributor(address account) internal {
        distributors.report(account);
        emit DistributorReported(account);
    }

    function _unreportDistributor(address account) internal {
        distributors.unreport(account);
        emit DistributorUnreported(account);
    }
}
