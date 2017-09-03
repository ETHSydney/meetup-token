import * as assert from 'assert';
import Token from '../src/transferableToken';

const testMemberAddress1 = '0xf55583ff8461db9dfbbe90b5f3324f2a290c3356';
const testMemberAddress2 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';
const testMemberAddress3 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';

const testContractOwner = '0x8ae386892b59bd2a7546a9468e8e847d61955991';
const testContractAddress = '0xE2f209931E1526ce740Fb77A3fF0F3b2eaB5e74e';

const accountPassword = 'meetup';

let meetupToken: Token;

describe("Token tests", function()
{
    beforeEach(function()
    {
        meetupToken = new Token("ws://localhost:8647",
            testContractOwner,
            testContractAddress,
            accountPassword);
    });

    it("deploy contract", async function(done)
    {
        try {
            const contractAddress = await meetupToken.deployContract(testContractOwner, "TEST", "Test Name");

            expect(contractAddress).toBeDefined();
            expect(contractAddress.length).toEqual(42, "contract address must be 42 characters including the prefixed 0x");
            expect(contractAddress.substring(0, 2)).toEqual('0x', "deployed contract address must start with 0x");

            const symbol = await meetupToken.getSymbol();
            expect(symbol).toEqual('TEST');

            const name = await meetupToken.getName();
            expect(name).toEqual('Test Name');

            const totalSupply = await meetupToken.getTotalSupply();
            expect(totalSupply).toEqual(0);

            const balance1 = await meetupToken.getBalanceOf(testMemberAddress1);
            expect(balance1).toEqual(0);

            done();
        }
        catch(err) {
            expect(err).not.toBeDefined();
            done();
            // TODO need to update jasmine-node to 2.0.0 for this to work
            //done.fail(`contract deploy failed with ${err.toString()}`)
        }
    }, 40000);

    it("deploy and issue tokens", async function(done)
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
            expect(contractAddress).toBeDefined();
            expect(typeof contractAddress).toEqual('string');
            expect(contractAddress.length).toEqual(42);

            const transactionsHash1 = await newMeetupToken.issueTokens(testMemberAddress1, 10, "123456789", 'newMember');
            // TODO replace with custom matcher
            expect(transactionsHash1).toBeDefined();
            expect(typeof transactionsHash1).toEqual('string');
            expect(transactionsHash1.length).toEqual(66);

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

            expect(externalIdsFromAllEvents.length).toEqual(3);
            expect(externalIdsFromNewMemberEvents.length).toEqual(2);

            done();
        }
        catch (err)
        {
            expect(err).not.toBeDefined();
            done();
            // TODO need to update jasmine-node to 2.0.0 for this to work
            //done.fail(`contract deploy failed with ${err.toString()}`)
        }
    }, 120000);

    it("issue and redeem agaisnt a previously deployed contract", async function testExistingContractIssue(done) {
        try {
            const totalSupply: number = await meetupToken.getTotalSupply();
            expect(totalSupply).toBeGreaterThan(0, "Total Supply > 0");

            const testMemberBalance1BeforeIssue: number = await meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance before issue = ${testMemberBalance1BeforeIssue}`);

            expect(testMemberBalance1BeforeIssue).toBeGreaterThan(0);
            expect(typeof testMemberBalance1BeforeIssue).toEqual('number', "member balance must be a number");

            let testMemberBalance2BeforeIssue: number = await meetupToken.getBalanceOf(testMemberAddress2);
            console.log(`second member balance before issue = ${testMemberBalance2BeforeIssue}`);

            expect(testMemberBalance1BeforeIssue).toBeGreaterThan(0);
            expect(typeof testMemberBalance1BeforeIssue).toEqual('number', "member balance must be a number");

            const transactionsHash1 = await meetupToken.issueTokens(testMemberAddress1, 111, "123456789", 'newMember');
            console.log(`Transaction hash from token issue: ${transactionsHash1}`);

            const transactionsHash2 = await meetupToken.issueTokens(testMemberAddress2, 222, "987654321", 'newMember');
            console.log(`Transaction hash from token issue: ${transactionsHash2}`);

            const testMemberBalance1AfterIssue: number = await meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance after issue = ${testMemberBalance1AfterIssue}`);

            expect(testMemberBalance1AfterIssue).toEqual(testMemberBalance1BeforeIssue + 111);

            const testMemberBalance2AfterIssue: number = await meetupToken.getBalanceOf(testMemberAddress2);
            console.log(`second member balance after issue = ${testMemberBalance2AfterIssue}`);

            expect(testMemberBalance2AfterIssue).toEqual(testMemberBalance2BeforeIssue + 222);

            done();
        }
        catch (err) {
            expect(err).not.toBeDefined();
            done();
            // TODO need to update jasmine-node to 2.0.0 for this to work
            //done.fail(`contract deploy failed with ${err.toString()}`)
        }
    }, 200000);

    it("deploy contract, issue tokens and get events", async function testEvents(done)
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

            expect(externalIdsFromAllEvents.length).toEqual(3);
            expect(externalIdsFromNewMemberEvents.length).toEqual(2);

            done();
        }
        catch (err)
        {
            expect(err).not.toBeDefined();
            done();
            // TODO need to update jasmine-node to 2.0.0 for this to work
            //done.fail(`contract deploy failed with ${err.toString()}`)
        }
    }, 120000);
});


