# Meetup token
An [Ethereum](https://www.ethereum.org/) [ERC20](https://github.com/ethereum/EIPs/issues/20) compatible token for members of a [meetup.com](http://www.meetup.com/) group.

# Smart Contract
The solidity code for the smart contract is in [transferableToken.sol](./contracts/transferableToken.sol)

The Sydney Ethereum contract address is `0xe06eda7435ba749b047380ced49121dde93334ae`

The contract can be viewed Etherscan at https://etherscan.io/address/0xe06eda7435ba749b047380ced49121dde93334ae 

The Application Binary Interface (ABI) for the contract is in [TransferableMeetupToken.abi](./bin/contracts/TransferableMeetupToken.abi)

# Installation
Once Node.js has been installed run the following
```
npm install meetup-token
```

## Usage
```
./mcoin.js [options] [command]

  Options:
    -k, --key <key>                Meetup API key
    -m, --meetupName <meetupName>  Meetup name. eg SydEthereum
    -h, --wshost <wsHost>          Host of WS-RPC server listening interface (default: "localhost")
    -p, --wsport <wsPort>          Post of WS-RPC server listening interface (default: "8546")
    -o, --owner <owner>            Address of contract owner
    -c, --contract <contract>      Contract address of the Meetup token
    -s, --symbol <symbol>          Symbol of the Mettup token (default "SET")
    -t, --tokenName <tokenName>    Name of the Meetup token (default "Transferable Sydney Ethereum Token")
    -h, --help                     output usage information

  Commands:
    deploy      deploy new Meetup token contract
    members     Issue tokens to new members of the Meetup
    event <id>  Issue tokens to members who attended a Meetup event with Meetup event id
```
## Configuration
Configuration files are under the [config](./config) folder. The command options will override any configured values.

* [logger.yaml](config/logger.yaml) sets the logging level
* [meetup.yaml](config/meetup.yaml) sets the Meetup API key and meetup name.
* [token.yaml](config/token.yaml) sets Ethereum node connection details and details about the token smart contract.

# Why?
This project is primarily about getting the [Sydney Ethereum](https://www.meetup.com/SydEthereum/) community to collaborate on a project and explore the uses of an Ethereum token. The initial thoughts are it could be used for voting rights and promotional offers. It'll be open to the community to further innovate with the token.

The other reason for the project is to give the members of the community who have not been hands on with Ethereum encouragement to setup a wallet and explore the Ethereum ecosystem. Since they are getting the token for free, it's a good way to bring people in and start thinking about how tokens could be used in their lives. This could be for community, business, government, study or anything else.

# How does it work?
Members will enter their public Ethereum address in their introduction section of their meetup profile. The introduction is different for each meetup group they are a member of so different tokens can be used for different groups.
The public key can be anywhere in the intro field as the program will just selected the first word that complies to the Ethereum address rules. eg start with 0x and is then 40 hexadecimal characters. eg 0x93B7fe67cb18D5900a19C25C4a72240392502c6d

When a member joins the meetup group and have entered their Ethereum address in their intro, a number of tokens will be issued to them. When they attend a meetup more tokens will be issued to them. The amount of tokens issued is configurable and is up to the meetup group to decide their rules.

# Testing
## Geth
This project comes with scripts to run a development instance of geth to test deploying a token contract and issuing tokens to it.

### Initial Setup
In the [scripts](./scripts) folder, run the following commands on a Mac OSX or Linux platform
```
cd scripts
chmod a+x initGeth.sh
./initGeth.sh
```

This is start a new development blockchain using the [genesis.json](./scripts/genesis.json) file. The chain data will be under [testchain](./testchain) in the geth folder.

### Starting Geth
If the above initial setup has already been done, the development geth node can be started with
```
cd scripts
chmod a+x startGeth.sh
./startGeth.sh
```

## Parity

## Starting Parity
In the [scripts](./scripts) folder, run the following commands on a Mac OSX or Linux platform
```
cd scripts
chmod a+x startParity.sh
./startParity.sh
```

This is start a new development blockchain using the [meetupChainSpec.json](./scripts/meetupChainSpec.json) specification file and [parityDevConfig.toml](./scripts/parityDevConfig.toml) config file. The chain data will be under [testchain](./testchain) in the parity folder.
