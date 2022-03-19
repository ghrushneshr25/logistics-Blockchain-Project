pragma solidity >=0.4.24;

import "./Agents.sol";
import "./Owner.sol";

contract Retailer is Owner {
    using Agents for Agents.Role;

    event RetailerAdded(address indexed account);
    event RetailerRemoved(address indexed account);
    event RetailerReported(address indexed account);
    event RetailerUnreported(address indexed account);

    Agents.Role private retailers;

    modifier onlyRetailer(address account) {
        require(isRetailer(account));
        _;
    }

    function isRetailer(address account) public view returns (bool) {
        return retailers.has(account);
    }

    function addRetailer(address account) public onlyOwner {
        _addRetailer(account);
    }

    function reportRetailer(address account) public {
        _reportRetailer(account);
    }

    function unreportRetailer(address account) public {
        _unreportRetailer(account);
    }

    function renounceRetailer(address account) internal onlyOwner {
        _removeRetailer(account);
    }

    function _addRetailer(address account) internal {
        retailers.add(account);
        emit RetailerAdded(account);
    }

    function _removeRetailer(address account) internal {
        retailers.remove(account);
        emit RetailerRemoved(account);
    }

    function _reportRetailer(address account) internal {
        retailers.report(account);
        emit RetailerReported(account);
    }

    function _unreportRetailer(address account) internal {
        retailers.unreport(account);
        emit RetailerUnreported(account);
    }
}
