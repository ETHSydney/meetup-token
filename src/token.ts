import * as Web3 from 'web3';
import * as VError from 'verror';
import * as _ from "underscore";
import * as logger from 'config-logger';

export default class TransferableMeetupToken
{
    readonly web3: any;
    readonly jsonInterface = [{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_spender","type":"address"},{"name":"_value","type":"uint256"}],"name":"approve","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_addr","type":"address"},{"name":"_amount","type":"uint256"}],"name":"redeem","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transferFrom","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_meetupId","type":"uint256"},{"name":"_addr","type":"address"},{"name":"_amount","type":"uint256"}],"name":"issue","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_addr","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_to","type":"address"},{"name":"_value","type":"uint256"}],"name":"transfer","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"_owner","type":"address"},{"name":"_spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining_","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"_symbol","type":"string"},{"name":"_name","type":"string"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_meetupId","type":"uint256"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Issue","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_from","type":"address"},{"indexed":true,"name":"_to","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_owner","type":"address"},{"indexed":true,"name":"_spender","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"Approval","type":"event"}];
    readonly binary = '0x606060405260058054600160a060020a03191633600160a060020a0316179055341561002a57600080fd5b6040516108aa3803806108aa8339810160405280805182019190602001805190910190505b600182805161006292916020019061007f565b50600281805161007692916020019061007f565b505b505061011f565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100c057805160ff19168380011785556100ed565b828001600101855582156100ed579182015b828111156100ed5782518255916020019190600101906100d2565b5b506100fa9291506100fe565b5090565b61011c91905b808211156100fa5760008155600101610104565b5090565b90565b61077c8061012e6000396000f300606060405236156100a15763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100a6578063095ea7b31461013157806318160ddd146101555780631e9a69501461017a57806323b872dd1461019e5780633ffa884c146101c857806370a08231146101ef57806395d89b4114610220578063a9059cbb146102ab578063dd62ed3e146102cf575b600080fd5b34156100b157600080fd5b6100b9610306565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156100f65780820151818401525b6020016100dd565b50505050905090810190601f1680156101235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561013c57600080fd5b610153600160a060020a03600435166024356103af565b005b341561016057600080fd5b610168610414565b60405190815260200160405180910390f35b341561018557600080fd5b610153600160a060020a036004351660243561041b565b005b34156101a957600080fd5b610153600160a060020a03600435811690602435166044356104bb565b005b34156101d357600080fd5b610153600435600160a060020a036024351660443561052c565b005b34156101fa57600080fd5b610168600160a060020a03600435166105a9565b60405190815260200160405180910390f35b341561022b57600080fd5b6100b96105c8565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156100f65780820151818401525b6020016100dd565b50505050905090810190601f1680156101235780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34156102b657600080fd5b610153600160a060020a0360043516602435610671565b005b34156102da57600080fd5b610168600160a060020a0360043581169060243516610681565b60405190815260200160405180910390f35b61030e61073e565b60028054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103a45780601f10610379576101008083540402835291602001916103a4565b820191906000526020600020905b81548152906001019060200180831161038757829003601f168201915b505050505090505b90565b600160a060020a03338116600081815260046020908152604080832094871680845294909152908190208490557f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259084905190815260200160405180910390a35b5050565b6000545b90565b60055433600160a060020a0390811691161461043657600080fd5b600160a060020a0382166000908152600360205260409020548190101561045c57600080fd5b600080548290038155600160a060020a03831680825260036020526040808320805485900390557fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9084905190815260200160405180910390a35b5050565b600160a060020a03808416600090815260046020908152604080832033909416835292905220548111156104ee57600080fd5b600160a060020a03808416600090815260046020908152604080832033909416835292905220805482900390556105268383836106ae565b5b505050565b60055433600160a060020a0390811691161461054757600080fd5b6000805482018155600160a060020a03831680825260036020526040918290208054840190559084907f3e1d8156c61243a0352920516bb9c7d0517fca750d6d6afebc0bed0d457a609b9084905190815260200160405180910390a35b505050565b600160a060020a0381166000908152600360205260409020545b919050565b6105d061073e565b60018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156103a45780601f10610379576101008083540402835291602001916103a4565b820191906000526020600020905b81548152906001019060200180831161038757829003601f168201915b505050505090505b90565b6104103383836106ae565b5b5050565b600160a060020a038083166000908152600460209081526040808320938516835292905220545b92915050565b600160a060020a0383166000908152600360205260409020548111156106d357600080fd5b600160a060020a038084166000818152600360205260408082208054869003905592851680825290839020805485019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9084905190815260200160405180910390a35b505050565b602060405190810160405260008152905600a165627a7a723058203bc2b9647acf880fb11158c8a49a37c5c6433c696f76eecd20b96e0eb772fcbf0029';
    contract: any;
    contractOwner: string;

    defaultGas = 100000;
    defaultGasPrice = 4000000000;

    transactions: { [transactionHash: string] : number; } = {};

    constructor(readonly wsURL: string, contractAddress: string, contractOwner: string)
    {
        this.contractOwner = contractOwner;

        this.web3 = new Web3(wsURL);
        this.contract = new this.web3.eth.Contract(this.jsonInterface, contractAddress, {
            from: contractOwner
        });
    }

    // deploy a new contract
    deployContract(fromAddress: string, gas = 800000, gasPrice = 4000000000): Promise<string>
    {
        const self = this;

        const description = `deploy transferable meetup token from sender address ${self.contractOwner}, gas ${gas} and gasPrice ${gasPrice}`;

        return new Promise<string>((resolve, reject) => {
            self.contract.deploy({
                data: self.binary,
                arguments: ['TMT', 'Transferable Meetup Token']
            })
            .send({
                from: fromAddress,
                gas: gas,
                gasPrice: gasPrice
            })
            .on('transactionHash', (hash: string) => {
                logger.debug(`Got transaction hash ${hash} from ${description}`);

                self.transactions[hash] = 0;
            })
            .on('receipt', (receipt: object) => {
                logger.debug(`Created contract with address ${receipt.contractAddress} using ${receipt.gasUsed} gas for ${description}`);

                self.contract.options.address = receipt.contractAddress;
                resolve(receipt.contractAddress);
            })
            .on('confirmation', (confirmationNumber: number, receipt: object) =>
            {
                logger.debug(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);

                self.transactions[receipt.transactionHash] = confirmationNumber;
            })
            .on('error', (err: Error) => {
                const error = new VError(err, `Failed to ${description}.`);
                logger.error(error.stack);
                reject(error);
            });
        });
    }

    // issue an amount of tokens to an address
    issueTokens(meetupProfileId: number, toAddress: string, amount: number, _gas?: number, _gasPrice?: number): Promise<string>
    {
        const self = this;
        let resolved = false;

        const description = `issue tokens to contract ${this.contract._address} from sender address ${self.contractOwner}, meetup profile id ${meetupProfileId}, to address ${toAddress} and amount ${amount}`;

        const gas = _gas || self.defaultGas;
        const gasPrice = _gasPrice || self.defaultGasPrice;

        return new Promise<string>((resolve, reject) =>
        {
            self.contract.methods.issue(meetupProfileId, toAddress, amount).send({
                from: self.contractOwner,
                gas: gas,
                gasPrice: gasPrice
            })
            .on('transactionHash', (hash: string) =>
            {
                logger.debug(`transaction hash ${hash} returned for ${description}`);
                self.transactions[hash] = 0;
            })
            .on('receipt', (receipt: object) =>
            {
                if (receipt.gasUsed == gas)
                {
                    const error = new VError(`Used all ${gas} gas so transaction probably threw for ${description}`);
                    logger.error(error.stack);
                    return reject(error);
                }

                logger.debug(`${receipt.gasUsed} gas used of a ${gas} gas limit for ${description}`);
                resolve(receipt.transactionHash);
            })
            .on('confirmation', (confirmationNumber: number, receipt: object) =>
            {
                logger.debug(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);

                self.transactions[receipt.transactionHash] = confirmationNumber;
            })
            .on('error', (err: Error) =>
            {
                const error = new VError(err, `Could not ${description}`);
                logger.error(error.stack);
                reject(error);
            });
        });
    }


    // redeem an amount of tokens from an address
    redeemTokens(toAddress: string, amount: number, _gas?: number, _gasPrice?: number): Promise<string>
    {
        const self = this;
        let resolved = false;

        const gas = _gas || self.defaultGas;
        const gasPrice = _gasPrice || self.defaultGasPrice;

        const description = `redeem tokens from contract ${this.contract._address} from sender address ${self.contractOwner}, to address ${toAddress} and amount ${amount}`;

        return new Promise<string>((resolve, reject) =>
        {
            self.contract.methods.redeem(toAddress, amount).send({
                from: self.contractOwner
            })
            .on('transactionHash', (hash: string) =>
            {
                logger.info(`${description} returned transaction hash ${hash}`);
                self.transactions[hash] = 0;
            })
            .on('receipt', (receipt: object) =>
            {
                if (receipt.gasUsed == gas)
                {
                    const error = new VError(`Used all ${gas} gas so transaction probably threw for ${description}`);
                    logger.error(error.stack);
                    return reject(error);
                }

                logger.debug(`${receipt.gasUsed} gas used of a ${gas} gas limit for ${description}`);
                resolve(receipt.transactionHash);
            })
            .on('confirmation', (confirmationNumber: number, receipt: object) =>
            {
                logger.debug(`${confirmationNumber} confirmations for ${description} with transaction hash ${receipt.transactionHash}`);
                self.transactions[receipt.transactionHash] = confirmationNumber;
            })
            .on('error', (err: Error) =>
            {
                const error = new VError(err, `Could not ${description}`);
                logger.error(error.stack);
                reject(error);
            });
        });
    }

    async getSymbol(): Promise<string>
    {
        const description = `symbol of contract at address ${this.contract._address}`;

        try
        {
            const symbol = await this.contract.methods.symbol().call();

            logger.info(`Got ${symbol} ${description}`);
            return symbol;
        }
        catch (err)
        {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async getName(): Promise<string>
    {
        const description = `name of contract at address ${this.contract._address}`;

        try
        {
            const name = await this.contract.methods.name().call();

            logger.info(`Got ${name} ${description}`);
            return name;
        }
        catch (err)
        {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async getTotalSupply(): Promise<number>
    {
        const description = `total supply of contract at address ${this.contract._address}`;

        try
        {
            const totalSupply = await this.contract.methods.totalSupply().call();

            logger.info(`Got ${totalSupply} ${description}`);
            return totalSupply;
        }
        catch (err)
        {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async getBalanceOf(address: string): Promise<number>
    {
        const description = `balance of address ${address} in contract at address ${this.contract._address}`;

        try
        {
            const balance = await this.contract.methods.balanceOf(address).call();

            logger.info(`Got ${balance} ${description}`);
            return balance;
        }
        catch (err)
        {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async getIssuedMembers(): Promise<number[]>
    {
        const description = `get member ids from past Issue events of contract at address ${this.contract._address}`;

        try
        {
            const events = await this.contract.getPastEvents('Issue', {
                fromBlock: 0
            });

            const meetupIds: number[] = _.chain(events)
                .map(event => {return event.returnValues["0"];})
                .uniq()
                .value();

            logger.info(`${meetupIds.length} member ids successfully returned from ${description}`);

            return meetupIds;
        }
        catch (err)
        {
            const error = new VError(err, `Could not ${description}`);
            console.log(error.stack);
            throw error;
        }
    }
}
