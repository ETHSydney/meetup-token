import Token from '../src/token';

const testMemberAddress1 = '0xf55583ff8461db9dfbbe90b5f3324f2a290c3356';
const testMemberAddress2 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';

const testContractOwner = '0x8ae386892b59bd2a7546a9468e8e847d61955991';
const testContractAddress = '0xA45125D4eCb367ccD4C626ACFfB355CC4A96a32a';

const meetupToken = new Token("ws://localhost:8647",
    testContractAddress,
    testContractOwner);


function testDeployContract()
{
    meetupToken.deployContract(testContractOwner)
        .then(contractAddress => {
            console.log(`New deployed transferable meetup token contract address: ${contractAddress}`);
        })
        .catch(err => {console.log(`Failed to deploy a transferable meetup token. Error: ${err.message}`);});
}

// testDeployContract();

async function testExistingContractIssue()
{
    try
    {
        const symbol: string = await meetupToken.getSymbol();
        console.log(`symbol = ${symbol}`);


        const name: string = await meetupToken.getName();
        console.log(`name = ${name}`);

        const totalSupply: number = await meetupToken.getTotalSupply();
        console.log(`total supply = ${totalSupply}`);

        let testMemberBalance1: number = await meetupToken.getBalanceOf(testMemberAddress1);
        console.log(`first member balance before issue = ${testMemberBalance1}`);
        let testMemberBalance2: number = await meetupToken.getBalanceOf(testMemberAddress2);
        console.log(`second member balance before issue = ${testMemberBalance2}`);

        const transactionsHash1 = await meetupToken.issueTokens(123456789, testMemberAddress1, 111);
        console.log(`Transaction hash from token issue: ${transactionsHash1}`);

        const transactionsHash2 = await meetupToken.issueTokens(987654321, testMemberAddress2, 222);
        console.log(`Transaction hash from token issue: ${transactionsHash2}`);

        testMemberBalance1 = await meetupToken.getBalanceOf(testMemberAddress1);
        console.log(`first member balance after issue = ${testMemberBalance1}`);

        const transactionsHash3 = await meetupToken.redeemTokens(testMemberAddress1, 11);
        console.log(`Transaction hash from token redeem: ${transactionsHash3}`);

        testMemberBalance1 = await meetupToken.getBalanceOf(testMemberAddress1);
        console.log(`first member balance after redeem = ${testMemberBalance1}`);
    }
    catch (err) {
        console.log(`Failed testExistingContractIssue. Error: ${err.message}`);
    }

}

testExistingContractIssue();

// meetupToken.getIssuedMembers()
//     .then(memberIds => {console.log(`Meetup members that have been issued a token: ${memberIds}`);})
//     .catch(err => {console.log(`Failed to get issued members. Error: ${err.message}`);});

