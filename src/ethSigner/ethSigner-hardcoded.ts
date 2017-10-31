import EthSignerAbstract from './ethSigner-abstract';
import * as VError from 'verror';
import * as logger from 'config-logger';

export default class EthSigner extends EthSignerAbstract
{
    getPrivateKey(fromAddress: string): Promise<string>
    {
        return new Promise<string>(async(resolve, reject) =>
        {
            if(fromAddress == '0x8Ae386892b59bD2A7546a9468E8e847D61955991') {
                resolve('0x26a1887e3a3ee4e632394256f4da44a2d364db682398fc2c3f8176ef2dacebda');
            }
            else {
                const error = new VError(`could not get private key for address ${fromAddress}`);
                logger.error(error.stack);
                reject(error);
            }
        });
    }
}