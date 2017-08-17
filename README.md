# Meetup token
An [Ethereum](https://www.ethereum.org/) [ERC20](https://github.com/ethereum/EIPs/issues/20) compatible token for members of a [meetup.com](http://www.meetup.com/) group.

# Installation
Once Node.js has been installed run the following
```
npm install meetup-token
```

## Configuration
How to config your meetup

## Usage


# Why?
This project is primarily about getting the [Sydney Ethereum](https://www.meetup.com/SydEthereum/) community to collaborate on a project and explore the uses of an Ethereum token. The initial thoughts are it could be used for voting rights and promotional offers. It'll be open to the community to further innovate with the token.

The other reason for the project is to give the members of the community who have not been hands on with Ethereum encouragement to setup a wallet and explore the Ethereum ecosystem. Since they are getting the token for free, it's a good way to bring people in and start thinking about how tokens could be used in their lives. This could be for community, business, government, study or anything else.

# How does it work?
Members will enter their public Ethereum address in their introduction section of their meetup profile. The introduction is different for each meetup group they are a member of so different tokens can be used for different groups.
The public key can be anywhere in the intro field as the program will just selected the first word that complies to the Ethereum address rules. eg start with 0x and is then 40 hexadecimal characters. eg 0x93B7fe67cb18D5900a19C25C4a72240392502c6d

When a member joins the meetup group and have entered their Ethereum address in their intro, a number of tokens will be issued to them. When they attend a meetup more tokens will be issued to them. The amount of tokens issued is configurable and is up to the meetup group to decide their rules.

# Tokens
There will be two types of tokens for the meetup. One is transferrable to any Ethereum address and is not linked to the meetup identity, the other is non transferrable and links with the smart contract the meetup.com identity.
https://github.com/bokkypoobah/TokenTrader/wiki/Supported-ERC20-Tokens

## Transferrable token
* tokens can be transferred between any Ethereum address.

## Non transferrable token
* tokens can NOT be transferred to another Ethereum address
* each token is associated with a meetup identity
* each token is associated with an meeting event or the initial membership

## Common token features
* The token owner can issue any number of tokens to any address at any time. The tokens are not issued at creation or capped.
* The token owner can burn any number of tokens of any address at any time.

# Meetup member use cases
* A member who has not attended any meetings registers their Ethereum address
* A member who has attended previous meetings registers their Ethereum address
* A member changes their Ethereum address
* A member removes their Ethereum address
* A member attends a meetup event

# Token use cases
* Token is created and token owner registered
* Token owner is updated
* An address of a member is registered
* An address of a member is deregistered
* The token holder transfers tokens to another registered member
* The token holder issues tokens to another registered member

FAQ
* Who is the token owner? For practical reasons, the token owner will be a number of people who know the private key to the owner account.
* How do you stop people creating multiple meetup profiles? You can't. The tokens aren't worth anything so people trying to game the system for free tokens are wasting their time.


