"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethers_1 = require("ethers");
const logger = require("config-logger");
class EthSignerAbstract {
    async signTransaction(tx) {
        const privateKey = await this.getPrivateKey(tx.from);
        const wallet = new ethers_1.Wallet(privateKey);
        logger.debug(`created wallet from private key for address ${wallet.address}`);
        //TODO check wallet address matches transaction from address
        const signedTx = wallet.sign(tx);
        logger.debug(`Signed transaction for ${JSON.stringify(tx)} was:\n${signedTx}`);
        return signedTx;
    }
}
exports.default = EthSignerAbstract;
//# sourceMappingURL=ethSigner-abstract.js.map