"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function extractEthAddress(fromText) {
    // split on one or more spaces, commas or tabs
    const words = fromText.split(/[ ,\t]+/);
    let returnString;
    words.forEach((word) => {
        if (word.length == 42 &&
            word.substr(0, 2) == '0x') {
            returnString = word;
        }
    });
    return returnString;
}
exports.extractEthAddress = extractEthAddress;
//# sourceMappingURL=ethUtils.js.map