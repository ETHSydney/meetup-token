"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BN = require("bn.js");
const ethers_1 = require("ethers");
const transferableToken_1 = require("../src/transferableToken");
const keyStore_hardcoded_1 = require("../src/keyStore/keyStore-hardcoded");
const testMemberAddress1 = '0xf55583ff8461db9dfbbe90b5f3324f2a290c3356';
const testMemberAddress2 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';
const testMemberAddress3 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';
const testContractOwner = '0x8Ae386892b59bD2A7546a9468E8e847D61955991';
const testContractAddress = '0x5DafbBe70ece05c938862a8301882E81612b46b5';
const accountPassword = 'meetup';
let meetupToken;
describe("Token tests", function () {
    const provider = new ethers_1.providers.JsonRpcProvider("http://localhost:8646", true, 100);
    beforeEach(function () {
        meetupToken = new transferableToken_1.default(provider, testContractOwner, new keyStore_hardcoded_1.default(), testContractAddress, accountPassword);
    });
    it("deploy contract", async function (done) {
        try {
            const txReceipt = await meetupToken.deployContract(testContractOwner, "TEST", "Test Name");
            expect(txReceipt.contractAddress.length).toEqual(42, "contract address must be 42 characters including the prefixed 0x");
            expect(txReceipt.contractAddress.substring(0, 2)).toEqual('0x', "deployed contract address must start with 0x");
            const symbol = await meetupToken.getSymbol();
            expect(symbol).toEqual('TEST');
            const name = await meetupToken.getName();
            expect(name).toEqual('Test Name');
            const totalSupply = await meetupToken.getTotalSupply();
            expect(totalSupply.toNumber()).toEqual(0);
            const balance1 = await meetupToken.getBalanceOf(testMemberAddress1);
            expect(balance1.toNumber()).toEqual(0);
            done();
        }
        catch (err) {
            expect(err).not.toBeDefined();
            done();
            // TODO need to update jasmine-node to 2.0.0 for this to work
            //done.fail(`contract deploy failed with ${err.toString()}`)
        }
    }, 40000);
    it("deploy and issue tokens", async function (done) {
        try {
            const newMeetupToken = new transferableToken_1.default(provider, testContractOwner, new keyStore_hardcoded_1.default(), null, // Contract Address,
            accountPassword);
            const txReceipt = await newMeetupToken.deployContract(testContractOwner);
            expect(typeof txReceipt.contractAddress).toEqual('string');
            expect(txReceipt.contractAddress.length).toEqual(42);
            const issueTxReceipt = await newMeetupToken.issueTokens(testMemberAddress1, 10, "123456789", 'newMember');
            // TODO replace with custom matcher
            expect(issueTxReceipt.transactionHash).toBeDefined();
            expect(typeof issueTxReceipt.transactionHash).toEqual('string');
            expect(issueTxReceipt.transactionHash.length).toEqual(66);
            const issueTxReceipt2 = await newMeetupToken.issueTokens(testMemberAddress1, 20, "123456789", 'attendEvent');
            const issueTxReceipt3 = await newMeetupToken.issueTokens(testMemberAddress1, 30, "123456789", 'speakAtEvent');
            console.log(`Transaction hashes from tokens issued to first address: ${issueTxReceipt.transactionHash} ${issueTxReceipt2.transactionHash} ${issueTxReceipt3.transactionHash}`);
            await newMeetupToken.issueTokens(testMemberAddress2, 10, "987654321", 'newMember');
            await newMeetupToken.issueTokens(testMemberAddress3, 20, "987654321", 'attendEvent');
            await newMeetupToken.issueTokens(testMemberAddress3, 20, "111111111", 'attendEvent');
            console.log(`Tokens issued to second address`);
            const externalIdsFromAllEvents = await newMeetupToken.getIssueEvents();
            console.log(`Got ${externalIdsFromAllEvents.length} unique external ids all Issue events`);
            const externalIdsFromNewMemberEvents = await newMeetupToken.getIssueEvents('newMember');
            console.log(`Got ${externalIdsFromNewMemberEvents.length} unique external ids from newMember Issue events`);
            expect(externalIdsFromAllEvents.length).toEqual(6);
            expect(externalIdsFromNewMemberEvents.length).toEqual(2);
            done();
        }
        catch (err) {
            expect(err).not.toBeDefined();
            console.log(err.stack);
            done();
            // TODO need to update jasmine-node to 2.0.0 for this to work
            //done.fail(`contract deploy failed with ${err.toString()}`)
        }
    }, 120000);
    it("issue and redeem agaisnt a previously deployed contract", async function testExistingContractIssue(done) {
        try {
            const totalSupply = await meetupToken.getTotalSupply();
            expect(totalSupply.toNumber()).toBeGreaterThan(0, "Total Supply > 0");
            expect(totalSupply instanceof BN).toBe(true, "total supply must be a BN");
            const testMemberBalance1BeforeIssue = await meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance before issue = ${testMemberBalance1BeforeIssue}`);
            expect(testMemberBalance1BeforeIssue.toNumber()).toBeGreaterThan(0);
            expect(testMemberBalance1BeforeIssue instanceof BN).toBe(true, "member balance must be a BN");
            let testMemberBalance2BeforeIssue = await meetupToken.getBalanceOf(testMemberAddress2);
            console.log(`second member balance before issue = ${testMemberBalance2BeforeIssue}`);
            expect(testMemberBalance1BeforeIssue.toNumber()).toBeGreaterThan(0);
            expect(testMemberBalance1BeforeIssue instanceof BN).toBe(true, "member balance must be a BN");
            const transactionsHash1 = await meetupToken.issueTokens(testMemberAddress1, 111, "123456789", 'newMember');
            console.log(`Transaction hash from token issue: ${transactionsHash1}`);
            const transactionsHash2 = await meetupToken.issueTokens(testMemberAddress2, 222, "987654321", 'newMember');
            console.log(`Transaction hash from token issue: ${transactionsHash2}`);
            const testMemberBalance1AfterIssue = await meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance after issue = ${testMemberBalance1AfterIssue}`);
            expect(testMemberBalance1AfterIssue.toNumber()).toEqual(testMemberBalance1BeforeIssue.add(new BN(111)).toNumber());
            const testMemberBalance2AfterIssue = await meetupToken.getBalanceOf(testMemberAddress2);
            console.log(`second member balance after issue = ${testMemberBalance2AfterIssue}`);
            expect(testMemberBalance2AfterIssue.toNumber()).toEqual(testMemberBalance2BeforeIssue.add(new BN(222)).toNumber());
            done();
        }
        catch (err) {
            console.log('Test failed from: ' + err);
            expect(err).not.toBeDefined();
            done();
            // TODO need to update jasmine-node to 2.0.0 for this to work
            //done.fail(`contract deploy failed with ${err.toString()}`)
        }
    }, 200000);
    it("deploy contract, issue tokens and get events", async function testEvents(done) {
        try {
            const newMeetupToken = new transferableToken_1.default(provider, testContractOwner, new keyStore_hardcoded_1.default(), null, // Contract Address,
            accountPassword);
            const txReceipt = await newMeetupToken.deployContract(testContractOwner);
            console.log(`New deployed transferable meetup token contract address: ${txReceipt.contractAddress}`);
            const issueTxReceipt = await newMeetupToken.issueTokens(testMemberAddress1, 10, "123456789", 'newMember');
            console.log(`Issue tokens hash ${txReceipt.transactionHash}`);
            const issueTxReceipt2 = await newMeetupToken.issueTokens(testMemberAddress1, 20, "123456789", 'attendEvent');
            const issueTxReceipt3 = await newMeetupToken.issueTokens(testMemberAddress1, 30, "123456789", 'speakAtEvent');
            console.log(`Transaction hashes from tokens issued to first address: ${issueTxReceipt.transactionHash} ${issueTxReceipt2.transactionHash} ${issueTxReceipt3.transactionHash}`);
            await newMeetupToken.issueTokens(testMemberAddress2, 10, "987654321", 'newMember');
            await newMeetupToken.issueTokens(testMemberAddress3, 20, "987654321", 'attendEvent');
            await newMeetupToken.issueTokens(testMemberAddress3, 20, "111111111", 'attendEvent');
            console.log(`Tokens issued to second address`);
            const externalIdsFromAllEvents = await newMeetupToken.getIssueEvents();
            console.log(`Got ${externalIdsFromAllEvents.length} unique external ids all Issue events`);
            const externalIdsFromNewMemberEvents = await newMeetupToken.getIssueEvents('newMember');
            console.log(`Got ${externalIdsFromNewMemberEvents.length} unique external ids from newMember Issue events`);
            expect(externalIdsFromAllEvents.length).toEqual(6);
            expect(externalIdsFromNewMemberEvents.length).toEqual(2);
            done();
        }
        catch (err) {
            expect(err).not.toBeDefined();
            done();
            // TODO need to update jasmine-node to 2.0.0 for this to work
            //done.fail(`contract deploy failed with ${err.toString()}`)
        }
    }, 120000);
});
//# sourceMappingURL=testTransferableTokenSpec.js.map