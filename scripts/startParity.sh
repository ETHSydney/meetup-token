#!/bin/sh

parity --chain meetupChainSpec.json --config parityDevConfig.toml --no-dapps --no-ui

# generates a UI token
#parity --chain meetupChainSpec.json --config parityDevConfig.toml signer new-token
