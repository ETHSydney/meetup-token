import * as assert from 'assert';
import Token from '../src/transferableToken';

const testMemberAddress1 = '0xf55583ff8461db9dfbbe90b5f3324f2a290c3356';
const testMemberAddress2 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';
const testMemberAddress3 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';

const testContractOwner = '0xd728cee2648a642fda9dc1218d2d5746848400ba';
const testContractAddress = '0x78bb290147d001be464491315d991ded1f248d8a';

const accountPassword = 'meetup';

const meetupToken = new Token("ws://localhost:8647",
    testContractOwner,
    testContractAddress,
    accountPassword);

async function testDeployContract()
{
    try {
        // TODO this has not yet been implemented in web3 1.0
        //await meetupToken.unlockAccount(accountPassword);

        const contractAddress = await meetupToken.deployContract(testContractOwner);

        console.log(`Successfully deployed transferable meetup token to contract address: ${contractAddress}`);
    }
    catch (err)
    {
        console.log(`Failed to deploy a transferable meetup token. Error: ${err.message}`);
    }
}

testDeployContract();

async function testEvents()
{

    try {
        const newMeetupToken = new Token("ws://localhost:8647",
            testContractOwner,
            null,
            //testContractAddress,
            accountPassword);

        // TODO this has not yet been implemented in web3 1.0
        //await newMeetupToken.unlockAccount(accountPassword);

        const contractAddress = await newMeetupToken.deployContract(testContractOwner);
        console.log(`New deployed transferable meetup token contract address: ${contractAddress}`);

        const transactionsHash1 = await newMeetupToken.issueTokens(testMemberAddress1, 10, "123456789", 'newMember');
        console.log(`Issue tokens hash ${transactionsHash1}`);

        const transactionsHash2 = await newMeetupToken.issueTokens(testMemberAddress1, 20, "123456789", 'attendEvent');
        const transactionsHash3 = await newMeetupToken.issueTokens(testMemberAddress1, 30, "123456789", 'speakAtEvent');
        console.log(`Transaction hashes from tokens issued to first address: ${transactionsHash1} ${transactionsHash2} ${transactionsHash3}`);

        await newMeetupToken.issueTokens(testMemberAddress2, 10, "987654321", 'newMember');
        await newMeetupToken.issueTokens(testMemberAddress3, 20, "987654321", 'attendEvent');
        await newMeetupToken.issueTokens(testMemberAddress3, 20, "111111111", 'attendEvent');
        console.log(`Tokens issued to second address`);

        const externalIdsFromAllEvents = await newMeetupToken.getIssueEvents();
        console.log(`Got ${externalIdsFromAllEvents.length} unique external ids all Issue events`);

        const externalIdsFromNewMemberEvents = await newMeetupToken.getIssueEvents('newMember');
        console.log(`Got ${externalIdsFromNewMemberEvents.length} unique external ids from newMember Issue events`);

        assert.equal(externalIdsFromAllEvents.length, 3);
        assert.equal(externalIdsFromNewMemberEvents.length, 2);
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

        const testMemberBalance1BeforeIssue: number = await meetupToken.getBalanceOf(testMemberAddress1);
        console.log(`first member balance before issue = ${testMemberBalance1BeforeIssue}`);
        let testMemberBalance2: number = await meetupToken.getBalanceOf(testMemberAddress2);
        console.log(`second member balance before issue = ${testMemberBalance2}`);

        const transactionsHash1 = await meetupToken.issueTokens(testMemberAddress1, 111, "123456789", 'newMember');
        console.log(`Transaction hash from token issue: ${transactionsHash1}`);

        const transactionsHash2 = await meetupToken.issueTokens(testMemberAddress2, 222, "987654321", 'newMember');
        console.log(`Transaction hash from token issue: ${transactionsHash2}`);

        const testMemberBalance1AfterIssue: number = await meetupToken.getBalanceOf(testMemberAddress1);
        console.log(`first member balance after issue = ${testMemberBalance1AfterIssue}`);

        assert.equal(testMemberBalance1AfterIssue, testMemberBalance1BeforeIssue + 111);

        const transactionsHash3 = await meetupToken.redeemTokens(testMemberAddress1, 11);
        console.log(`Transaction hash from token redeem: ${transactionsHash3}`);

        const testMemberBalance1AfterRedeem: number = await meetupToken.getBalanceOf(testMemberAddress1);
        console.log(`first member balance after redeem = ${testMemberBalance1AfterRedeem}`);

        assert.equal(testMemberBalance1AfterRedeem,testMemberBalance1BeforeIssue + 111 - 11);
    }
    catch (err) {
        console.log(`Failed testExistingContractIssue. Error: ${err.message}`);
    }
}

testExistingContractIssue();
