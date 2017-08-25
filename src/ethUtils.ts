
// extracts the first Ethereum address from a string of words
export function extractEthAddress(fromText: string) : void | string
{
    // split on one or more spaces, commas, tabs or carriage returns
    const words = fromText.split(/[ ,\t\n]+/);

    for (let word of words)
    {
        if (word.length == 42 &&
            word.substr(0,2) == '0x') {
            return word;
        }
    }
}