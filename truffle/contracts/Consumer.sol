// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24;

import "./Agents.sol";
import "./Owner.sol";

contract Consumer is Owner{
    using Agents for Agents.Role;

    event ConsumerAdded(address indexed account);
    event ConsumerRemoved(address indexed account);
    event ConsumerReported(address indexed account);
    event ConsumerUnreported(address indexed account);

    Agents.Role private consumers;

    modifier onlyConsumer(address account) {
        require(isConsumer(account));
        _;
    }

    function isConsumer(address account) public view returns (bool) {
        return consumers.has(account);
    }

    function addConsumer(address account) onlyOwner public {
        _addConsumer(account);
    }

    function reportConsumer(address account) public {
        _reportConsumer(account);
    }

    function unreportConsumer(address account) public {
        _unreportConsumer(account);
    }

    function renounceConsumer(address account) onlyOwner internal {
        _removeConsumer(account);
    }

    function _addConsumer(address account) internal {
        consumers.add(account);
        emit ConsumerAdded(account);
    }

    function _removeConsumer(address account) internal {
        consumers.remove(account);
        emit ConsumerRemoved(account);
    }

    function _reportConsumer(address account) internal {
        consumers.report(account);
        emit ConsumerReported(account);
    }

    function _unreportConsumer(address account) internal {
        consumers.unreport(account);
        emit ConsumerUnreported(account);
    }
}
