#!/bin/sh

geth --datadir ../testchain --unlock 0 --password ./testpassword --rpc --rpcapi "eth,net,web3,debug" --rpccorsdomain '*' --rpcport 8646 --ws --wsport 8647 --wsorigins="*" --port 32323 --mine --minerthreads 1 --maxpeers 0 --cache 1024 --targetgaslimit 994712388 --verbosity 2 console
