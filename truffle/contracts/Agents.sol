pragma solidity >=0.4.22 <0.9.0;
pragma experimental ABIEncoderV2;

library Agents {
    struct Role {
        mapping(address => bool) holder;
        mapping(address => bool) reported;
    }

    function add(Role storage role, address account) internal {
        require(account != address(0));
        require(!has(role, account));
        role.holder[account] = true;
        role.reported[account] = false;
    }

    function remove(Role storage role, address account) internal {
        require(account != address(0));
        require(has(role, account));
        role.holder[account] = false;
    }

    function report(Role storage role, address account) internal {
        require(account != address(0));
        require(has(role, account));
        role.reported[account] = true;
    }

    function unreport(Role storage role, address account) internal {
        require(account != address(0));
        require(has(role, account));
        role.reported[account] = false;
    }

    function has(Role storage role, address account)
        internal
        view
        returns (bool)
    {
        require(account != address(0));
        return role.holder[account];
    }
}
