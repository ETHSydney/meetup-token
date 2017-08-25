"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// extracts the first Ethereum address from a string of words
function extractEthAddress(fromText) {
    // split on one or more spaces, commas, tabs or carriage returns
    const words = fromText.split(/[ ,\t\n]+/);
    for (let word of words) {
        if (word.length == 42 &&
            word.substr(0, 2) == '0x') {
            return word;
        }
    }
}
exports.extractEthAddress = extractEthAddress;
//# sourceMappingURL=ethUtils.js.map