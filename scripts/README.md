geth console scripts that can be run to create, invoke and query the meetup token contracts

## Geth
The geth scripts will create a test network in the [testchain](../testchain) folder.

To initiate a fresh testchain run [initGeth.sh](./initGeth.sh).

To start a geth node with the testchain run [startGeth.sh](./tartGeth.sh).

The connection string to connect Remix or MetaMask to the local geth instance is `http://localhost:8646`

## Test Accounts

The keys to the accounts are in the [testchain/keystore](../testchain/keystore) folder.

New accounts are created by running `geth --datadir ../testchain account new` from this [scripts](./) folder.

# | Description | Address | Private Key
--|-------------|---------|------------
0 | | 0xd728cee2648a642fda9dc1218d2d5746848400ba | 
1 | | 0xf55583ff8461db9dfbbe90b5f3324f2a290c3356 | 

## Geth console scripts
