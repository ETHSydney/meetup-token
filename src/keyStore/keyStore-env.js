"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VError = require("verror");
const logger = require("config-logger");
class KeyStore {
    getPrivateKey(fromAddress) {
        return new Promise(async (resolve, reject) => {
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
exports.default = KeyStore;
//# sourceMappingURL=keyStore-env.js.map