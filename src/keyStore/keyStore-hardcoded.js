"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VError = require("verror");
const logger = require("config-logger");
class KeyStore {
    getPrivateKey(fromAddress) {
        return new Promise(async (resolve, reject) => {
            if (fromAddress == '0x8Ae386892b59bD2A7546a9468E8e847D61955991') {
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
exports.default = KeyStore;
//# sourceMappingURL=keyStore-hardcoded.js.map