/*
file:   SydneyEthereum.sol
ver:    0.1.0
updated:4-Aug-2017
author: Darryl Morris
email:  o0ragman0o AT gmail.com

An ERC20 compliant token with reentry protection and safe math.

This software is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
See MIT Licence for further details.
<https://opensource.org/licenses/MIT>.

Release Notes
-------------
0.1.0
*/

pragma solidity ^0.4.13;

contract ERC20Token
{
/* State */
    // The Total supply of tokens
    uint totSupply;
    
    /// @return Token symbol
    string sym;
    string nam;
    
    // Token ownership mapping
    mapping (address => uint) balance;
    
    // Allowances mapping
    mapping (address => mapping (address => uint)) allowed;

/* Events */
    // Triggered when tokens are transferred.
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 value);

    // Triggered whenever approve(address _spender, uint256 _value) is called.
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value);

/* Funtions Public */

    function symbol() public constant returns (string)
    {
        return sym;
    }

    function name() public constant returns (string)
    {
        return nam;
    }
    
    // Using an explicit getter allows for function overloading    
    function totalSupply() public constant returns (uint)
    {
        return totSupply;
    }
    
    // Using an explicit getter allows for function overloading    
    function balanceOf(address holderAddress) public constant returns (uint)
    {
        return balance[holderAddress];
    }
    
    // Using an explicit getter allows for function overloading    
    function allowance(address ownerAddress, address spenderAddress) public constant returns (uint remaining)
    {
        return allowed[ownerAddress][spenderAddress];
    }
        

    // Send amount amount of tokens to address _to
    // Reentry protection prevents attacks upon the state
    function transfer(address toAddress, uint256 amount) public
    {
        xfer(msg.sender, toAddress, amount);
    }

    // Send amount amount of tokens from address _from to address _to
    // Reentry protection prevents attacks upon the state
    function transferFrom(address fromAddress, address toAddress, uint256 amount) public
    {
        require(amount <= allowed[fromAddress][msg.sender]);
        allowed[fromAddress][msg.sender] -= amount;
        xfer(fromAddress, toAddress, amount);
    }

    // Process a transfer internally.
    function xfer(address fromAddress, address toAddress, uint amount) internal
    {
        require(amount <= balance[fromAddress]);
        balance[fromAddress] -= amount;
        balance[toAddress] += amount;
        Transfer(fromAddress, toAddress, amount);
    }

    // Approves a third-party spender
    // Reentry protection prevents attacks upon the state
    function approve(address spender, uint256 amount) public
    {
        allowed[msg.sender][spender] = amount;
        Approval(msg.sender, spender, amount);
    }
}

contract TransferableMeetupToken is ERC20Token
{
    address owner = msg.sender;
    
    function TransferableMeetupToken(string tokenSymbol, string toeknName)
    {
        sym = tokenSymbol;
        nam = toeknName;
    }
    
    event Issue(
        address indexed toAddress,
        uint256 amount,
        string externalId,
        string reason);

    event Redeem(
        address indexed fromAddress,
        uint256 amount);

    function issue(address toAddress, uint amount, string externalId, string reason) public
    {
        require(owner == msg.sender);
        totSupply += amount;
        balance[toAddress] += amount;
        Issue(toAddress, amount, externalId, reason);
    }
    
    function redeem(address fromAddress, uint amount) public
    {
        require(owner == msg.sender);
        require(balance[fromAddress] >= amount);
        totSupply -= amount;
        balance[fromAddress] -= amount;
        Redeem(fromAddress, amount);
    }
}