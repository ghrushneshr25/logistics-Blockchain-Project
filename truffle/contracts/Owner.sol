pragma solidity >0.4.24;

contract Owner{
    address owner;
    constructor(){
        owner=msg.sender;
    }

    modifier onlyOwner(){
        require(owner==msg.sender);
        _;
    }
}