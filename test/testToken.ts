import * as assert from 'assert';
import Token from '../src/token';

const testMemberAddress1 = '0xf55583ff8461db9dfbbe90b5f3324f2a290c3356';
const testMemberAddress2 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';
const testMemberAddress3 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';

const testContractOwner = '0x8ae386892b59bd2a7546a9468e8e847d61955991';
const testContractAddress = '0x5DafbBe70ece05c938862a8301882E81612b46b5';

const accountPassword = 'meetup';

const meetupToken = new Token("ws://localhost:8647",
    testContractAddress,
    testContractOwner,
    accountPassword);

async function testDeployContract()
{
    try {
        // TODO this has not yet been implemented in web3 1.0
        //await meetupToken.unlockAccount(accountPassword);

        const contractAddress = await meetupToken.deployContract(testContractOwner);

        console.log(`New deployed transferable meetup token contract address: ${contractAddress}`);
    }
    catch (err)
    {
        console.log(`Failed to deploy a transferable meetup token. Error: ${err.message}`);
    }
}

//testDeployContract();

async function testEvents()
{
    const newMeetupToken = new Token("ws://localhost:8647",
        testContractAddress,
        testContractOwner,
        accountPassword);

    try {



        // TODO this has not yet been implemented in web3 1.0
        //await meetupToken.unlockAccount(accountPassword);

        //const contractAddress = await meetupToken.deployContract(testContractOwner);
        const contractAddress = '0xE63850AD37c8A72814e435f94c2E4c1Ad640af80';
        console.log(`New deployed transferable meetup token contract address: ${contractAddress}`);

        const transactionsHash1 = await meetupToken.issueTokens(testMemberAddress1, 10, 123456789, 'newMember');
        console.log(`Issue tokens hash ${transactionsHash1}`);

        const transactionsHash2 = await meetupToken.issueTokens(testMemberAddress1, 20, 123456789, 'attendEvent');
        const transactionsHash3 = await meetupToken.issueTokens(testMemberAddress1, 30, 123456789, 'speakAtEvent');
        console.log(`Transaction hashes from tokens issued to first address: ${transactionsHash1} ${transactionsHash2} ${transactionsHash3}`);

        await meetupToken.issueTokens(testMemberAddress2, 10, 987654321, 'newMember');
        await meetupToken.issueTokens(testMemberAddress3, 20, 987654321, 'attendEvent');
        console.log(`Tokens issued to second address`);

        const allEvents = await meetupToken.getIssueEvents();
        console.log(`Got ${allEvents.length} all issued events`);

        const newMemberEvents = await meetupToken.getIssueEvents('newMember');
        console.log(`Got ${newMemberEvents.length} newMember issued events`);

        assert.equal(allEvents.length, 5);
        assert.equal(newMemberEvents.length, 2);
    }
    catch (err)
    {
        console.log(`Failed events tests. Error: ${err.message}`);
    }
}

testEvents();

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

        const transactionsHash1 = await meetupToken.issueTokens(testMemberAddress1, 111, 123456789, 'newMember');
        console.log(`Transaction hash from token issue: ${transactionsHash1}`);

        const transactionsHash2 = await meetupToken.issueTokens(testMemberAddress2, 222, 987654321, 'newMember');
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

//testExistingContractIssue();
//
// meetupToken.getIssueEvents()
//     .then(memberIds => {console.log(`Meetup members that have been issued a token: ${memberIds}`);})
//     .catch(err => {console.log(`Failed to get issued members. Error: ${err.message}`);});

