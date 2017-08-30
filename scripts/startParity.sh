#!/bin/sh

parity --chain meetupChainSpec.json --config parityDevConfig.toml --ws-port 8647

# generates a UI token
#parity --chain meetupChainSpec.json --config parityDevConfig.toml signer new-token
