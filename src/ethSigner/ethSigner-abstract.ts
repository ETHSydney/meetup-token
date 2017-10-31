import {Wallet} from 'ethers';
import * as logger from 'config-logger';

import {Transaction, TransactionReceipt} from "./index.d";

export default abstract class EthSignerAbstract
{
    async signTransaction(tx: Transaction): Promise<TransactionReceipt>
    {
        const privateKey = await this.getPrivateKey(tx.from);

        const wallet = new Wallet(privateKey);
        logger.debug(`created wallet from private key for address ${wallet.address}`);

        //TODO check wallet address matches transaction from address

        const signedTx = wallet.sign(tx);

        logger.debug(`Signed transaction for ${JSON.stringify(tx)} was:\n${signedTx}`);

        return signedTx;
    }

    abstract getPrivateKey(fromAddress: string): Promise<string>;
}