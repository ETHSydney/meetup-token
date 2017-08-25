
export function extractEthAddress(fromText: string) : void | string
{
    // split on one or more spaces, commas or tabs
    const words = fromText.split(/[ ,\t\n]+/);

    let returnString: string;

    words.forEach((word) => {
        if (word.length == 42 &&
            word.substr(0,2) == '0x') {
            returnString = word;
        }
    });

    return returnString;
}