import * as VError from 'verror';
import * as logger from 'config-logger';

export default class KeyStore
{
    getPrivateKey(fromAddress: string): Promise<string>
    {
        return new Promise<string>(async(resolve, reject) =>
        {
            const privateKey = process.env[fromAddress];

            if (privateKey) {
                resolve(privateKey);
            }
            else {
                const error = new VError(`could not get private key for address ${fromAddress}`);
                logger.error(error.stack);
                reject(error);
            }
        });
    }
}