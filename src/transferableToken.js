"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const VError = require("verror");
const logger = require("config-logger");
class TransferableToken {
    constructor(transactionProvider, contractOwner, keyStore, contractAddress, accountPassword = "") {
        this.transactionProvider = transactionProvider;
        this.keyStore = keyStore;
        this.jsonInterface = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "fromAddress", "type": "address" }, { "name": "toAddress", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "toAddress", "type": "address" }, { "name": "amount", "type": "uint256" }, { "name": "externalId", "type": "string" }, { "name": "reason", "type": "string" }], "name": "issue", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "holderAddress", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "toAddress", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "amount", "type": "uint256" }], "name": "redeem", "outputs": [], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "ownerAddress", "type": "address" }, { "name": "spenderAddress", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "type": "function" }, { "inputs": [{ "name": "tokenSymbol", "type": "string" }, { "name": "toeknName", "type": "string" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "toAddress", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "externalId", "type": "string" }, { "indexed": false, "name": "reason", "type": "string" }], "name": "Issue", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "fromAddress", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }], "name": "Redeem", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "from", "type": "address" }, { "indexed": true, "name": "to", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "owner", "type": "address" }, { "indexed": true, "name": "spender", "type": "address" }, { "indexed": false, "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }];
        this.contractBinary = '0x60606040526003805460ff1916905560068054600160a060020a03191633600160a060020a0316179055341561003457600080fd5b604051610aa6380380610aa68339810160405280805182019190602001805190910190505b600182805161006c929160200190610089565b506002818051610080929160200190610089565b505b5050610129565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106100ca57805160ff19168380011785556100f7565b828001600101855582156100f7579182015b828111156100f75782518255916020019190600101906100dc565b5b50610104929150610108565b5090565b61012691905b80821115610104576000815560010161010e565b5090565b90565b61096e806101386000396000f300606060405236156100ac5763ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166306fdde0381146100b1578063095ea7b31461013c57806318160ddd1461016057806323b872dd14610185578063313ce567146101af57806364f018d8146101d857806370a082311461028157806395d89b41146102b2578063a9059cbb1461033d578063db006a7514610361578063dd62ed3e14610379575b600080fd5b34156100bc57600080fd5b6100c46103b0565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101015780820151818401525b6020016100e8565b50505050905090810190601f16801561012e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561014757600080fd5b61015e600160a060020a0360043516602435610459565b005b341561016b57600080fd5b6101736104be565b60405190815260200160405180910390f35b341561019057600080fd5b61015e600160a060020a03600435811690602435166044356104c5565b005b34156101ba57600080fd5b6101c2610536565b60405160ff909116815260200160405180910390f35b34156101e357600080fd5b61015e60048035600160a060020a03169060248035919060649060443590810190830135806020601f8201819004810201604051908101604052818152929190602084018383808284378201915050505050509190803590602001908201803590602001908080601f01602080910402602001604051908101604052818152929190602084018383808284375094965061053f95505050505050565b005b341561028c57600080fd5b610173600160a060020a03600435166106d6565b60405190815260200160405180910390f35b34156102bd57600080fd5b6100c46106f5565b60405160208082528190810183818151815260200191508051906020019080838360005b838110156101015780820151818401525b6020016100e8565b50505050905090810190601f16801561012e5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b341561034857600080fd5b61015e600160a060020a036004351660243561079e565b005b341561036c57600080fd5b61015e6004356107ae565b005b341561038457600080fd5b610173600160a060020a0360043581169060243516610873565b60405190815260200160405180910390f35b6103b8610930565b60028054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561044e5780601f106104235761010080835404028352916020019161044e565b820191906000526020600020905b81548152906001019060200180831161043157829003601f168201915b505050505090505b90565b600160a060020a03338116600081815260056020908152604080832094871680845294909152908190208490557f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b9259084905190815260200160405180910390a35b5050565b6000545b90565b600160a060020a03808416600090815260056020908152604080832033909416835292905220548111156104f857600080fd5b600160a060020a03808416600090815260056020908152604080832033909416835292905220805482900390556105308383836108a0565b5b505050565b60035460ff1681565b60065433600160a060020a0390811691161461055a57600080fd5b6000805484018155600160a060020a0385168082526004602052604091829020805486019055907ff852d0a3cf181ff3367de4646a22f9c0ea924ae0b367c74e07079a897f313c3c9085908590859051808481526020018060200180602001838103835285818151815260200191508051906020019080838360005b838110156105ef5780820151818401525b6020016105d6565b50505050905090810190601f16801561061c5780820380516001836020036101000a031916815260200191505b50838103825284818151815260200191508051906020019080838360005b838110156106535780820151818401525b60200161063a565b50505050905090810190601f1680156106805780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a283600160a060020a031660007fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8560405190815260200160405180910390a35b50505050565b600160a060020a0381166000908152600460205260409020545b919050565b6106fd610930565b60018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561044e5780601f106104235761010080835404028352916020019161044e565b820191906000526020600020905b81548152906001019060200180831161043157829003601f168201915b505050505090505b90565b6104ba3383836108a0565b5b5050565b600160a060020a033316600090815260046020526040902054819010156107d457600080fd5b600080548290038155600160a060020a033316808252600460205260409182902080548490039055907f222838db2794d11532d940e8dec38ae307ed0b63cd97c233322e221f998767a69083905190815260200160405180910390a2600033600160a060020a03167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405190815260200160405180910390a35b50565b600160a060020a038083166000908152600560209081526040808320938516835292905220545b92915050565b600160a060020a0383166000908152600460205260409020548111156108c557600080fd5b600160a060020a038084166000818152600460205260408082208054869003905592851680825290839020805485019055917fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef9084905190815260200160405180910390a35b505050565b602060405190810160405260008152905600a165627a7a7230582093fb9b0b386ac7c1a86afc71387842cc487c274af21cd559730fea90a372db9c0029';
        this.defaultGas = 100000;
        this.defaultGasPrice = 4000000000;
        this.transactions = {};
        this.contractAddress = contractAddress;
        this.contractOwner = contractOwner;
        this.accountPassword = accountPassword;
        this.contract = new ethers_1.Contract(contractAddress, this.jsonInterface, transactionProvider);
    }
    // deploy a new contract
    deployContract(contractOwner, symbol = "SET", tokenName = "Transferable Meetup token", gas = 900000, gasPrice = 4000000000) {
        const self = this;
        this.contractOwner = contractOwner;
        const description = `deploy transferable meetup token with token symbol ${symbol}, token name "${tokenName}" from sender address ${self.contractOwner}, gas ${gas} and gasPrice ${gasPrice}`;
        return new Promise(async (resolve, reject) => {
            logger.debug(`About to ${description}`);
            if (!self.contractBinary) {
                const error = new VError(`Binary for smart contract has not been set so can not ${description}.`);
                logger.error(error.stack);
                return reject(error);
            }
            try {
                const deployTransaction = ethers_1.Contract.getDeployTransaction(self.contractBinary, self.jsonInterface, symbol, tokenName);
                const wallet = new ethers_1.Wallet(await self.keyStore.getPrivateKey(contractOwner), self.transactionProvider);
                // Send the transaction
                const broadcastTransaction = await wallet.sendTransaction(deployTransaction);
                logger.debug(`${broadcastTransaction.hash} is transaction hash for ${description}`);
                // wait for the transaction to be mined
                const minedTransaction = await self.transactionProvider.waitForTransaction(broadcastTransaction.hash);
                logger.debug(`Created contract with address ${minedTransaction.creates} for ${description}`);
                self.contractAddress = minedTransaction.creates;
                self.contract = new ethers_1.Contract(self.contractAddress, self.jsonInterface, wallet);
                resolve(self.contractAddress);
            }
            catch (err) {
                const error = new VError(err, `Failed to ${description}.`);
                logger.error(error.stack);
                reject(error);
            }
        });
    }
    // issue an amount of tokens to an address
    issueTokens(toAddress, amount, externalId, reason, _gas, _gasPrice) {
        const self = this;
        const gas = _gas || self.defaultGas;
        const gasPrice = _gasPrice || self.defaultGasPrice;
        const description = `issue ${amount} tokens to address ${toAddress}, from sender address ${self.contractOwner}, contract ${this.contractAddress}, external id ${externalId} and reason ${reason} using ${gas} gas and ${gasPrice} gas price`;
        return new Promise(async (resolve, reject) => {
            try {
                const privateKey = await self.keyStore.getPrivateKey(self.contractOwner);
                const wallet = new ethers_1.Wallet(privateKey, self.transactionProvider);
                const contract = new ethers_1.Contract(self.contractAddress, self.jsonInterface, wallet);
                // send the transaction
                const broadcastTransaction = await contract.issue(toAddress, amount, externalId, reason, {
                    gasPrice: gasPrice,
                    gasLimit: gas
                });
                logger.debug(`${broadcastTransaction.hash} is transaction hash and nonce ${broadcastTransaction.nonce} for ${description}`);
                // wait for the transaction to be mined
                const minedTransaction = await this.transactionProvider.waitForTransaction(broadcastTransaction.hash);
                logger.debug(`${broadcastTransaction.hash} mined in block number ${minedTransaction.blockNumber} for ${description}`);
                const transactionReceipt = await this.transactionProvider.getTransactionReceipt(broadcastTransaction.hash);
                logger.debug(`Status ${transactionReceipt.status} and ${transactionReceipt.gasUsed} gas of ${gas} used for ${description}`);
                // If a status of 0 was returned then the transaction failed. Status 1 means the transaction worked
                if (transactionReceipt.hasOwnProperty('status') && transactionReceipt.status.eq(0)) {
                    const error = new VError(`Failed ${broadcastTransaction.hash} transaction with status code ${transactionReceipt.status} and ${gas} gas used.`);
                    logger.error(error.stack);
                    resolve(error);
                }
                resolve(broadcastTransaction.hash);
            }
            catch (err) {
                const error = new VError(err, `Failed to ${description}.`);
                logger.error(error.stack);
                reject(error);
            }
        });
    }
    async getSymbol() {
        const description = `symbol of contract at address ${this.contractAddress}`;
        try {
            const result = await this.contract.symbol();
            const symbol = result[0];
            logger.info(`Got ${symbol} ${description}`);
            return symbol;
        }
        catch (err) {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }
    async getName() {
        const description = `name of contract at address ${this.contractAddress}`;
        try {
            const result = await this.contract.name();
            const name = result[0];
            logger.info(`Got ${name} ${description}`);
            return name;
        }
        catch (err) {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }
    async getTotalSupply() {
        const description = `total supply of contract at address ${this.contractAddress}`;
        try {
            const result = await this.contract.totalSupply();
            const totalSupply = result[0]._bn;
            logger.info(`Got ${totalSupply} ${description}`);
            return totalSupply;
        }
        catch (err) {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }
    async getBalanceOf(address) {
        const description = `balance of address ${address} in contract at address ${this.contractAddress}`;
        try {
            const result = await this.contract.balanceOf(address);
            const balance = result[0]._bn;
            logger.info(`Got ${balance} ${description}`);
            return balance;
        }
        catch (err) {
            const error = new VError(err, `Could not get ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }
    async getIssueEvents(reason, fromBlock = 0) {
        const description = `get unique list of external ids from past Issue events with reason ${reason} from block ${fromBlock} and contract address ${this.contractAddress}`;
        const options = {
            fromBlock: fromBlock
        };
        try {
            logger.debug(`About to ${description}`);
            const IssueEvent = this.contract.interface.events.Issue();
            const logs = await this.transactionProvider.getLogs({
                fromBlock: fromBlock,
                toBlock: "latest",
                address: this.contractAddress,
                topics: IssueEvent.topics
            });
            const externalIds = [];
            for (const log of logs) {
                const logData = IssueEvent.parse(log.topics, log.data);
                if (!reason || reason && logData.reason == reason) {
                    externalIds.push(logData.externalId);
                }
            }
            logger.info(`${externalIds.length} unique external ids successfully returned from ${description}`);
            return externalIds;
        }
        catch (err) {
            const error = new VError(err, `Could not ${description}`);
            console.log(error.stack);
            throw error;
        }
    }
}
exports.default = TransferableToken;
//# sourceMappingURL=transferableToken.js.map