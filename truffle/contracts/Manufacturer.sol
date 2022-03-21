// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.24;

import "./Agents.sol";
import "./Owner.sol";

contract Manufacturer is Owner{
    using Agents for Agents.Role;

    event ManufacturerAdded(address indexed account);
    event ManufacturerRemoved(address indexed account);
    event ManufacturerReported(address indexed account);
    event ManufacturerUnreported(address indexed account);

    Agents.Role private manufacturers;

    modifier onlyManufacturer(address account) {
        require(isManufacturer(account));
        _;
    }

    function isManufacturer(address account) public view returns (bool) {
        return manufacturers.has(account);
    }

    function addManufacturer(address account) onlyOwner public {
        _addManufacturer(account);
    }

    function reportManufacturer(address account) public {
        _reportManufacturer(account);
    }

    function unreportManufacturer(address account) public {
        _unreportManufacturer(account);
    }

    function renounceManufacturer(address account) onlyOwner internal {
        _removeManufacturer(account);
    }

    function _addManufacturer(address account) internal {
        manufacturers.add(account);
        emit ManufacturerAdded(account);
    }

    function _removeManufacturer(address account) internal {
        manufacturers.remove(account);
        emit ManufacturerRemoved(account);
    }

    function _reportManufacturer(address account) internal {
        manufacturers.report(account);
        emit ManufacturerReported(account);
    }

    function _unreportManufacturer(address account) internal {
        manufacturers.unreport(account);
        emit ManufacturerUnreported(account);
    }
}
