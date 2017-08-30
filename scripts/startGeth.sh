#!/bin/sh

# Used for testing
geth --datadir ../testchain --unlock 0x8ae386892b59bd2a7546a9468e8e847d61955991 --password ./testpassword --rpc --rpcapi "eth,net,web3,debug" --rpccorsdomain '*' --rpcport 8646 --ws --wsport 8647 --wsaddr "localhost" --wsorigins="*" --port 32323 --mine --minerthreads 1 --maxpeers 0 --cache 1024 --targetgaslimit 994712388 --verbosity 2 console

# used for production
#geth --unlock 6 --ws --wsport 8647 --wsaddr "localhost" --wsorigins="*" --verbosity 2 console

