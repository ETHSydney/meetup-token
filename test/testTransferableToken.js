"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const transferableToken_1 = require("../src/transferableToken");
const testMemberAddress1 = '0xf55583ff8461db9dfbbe90b5f3324f2a290c3356';
const testMemberAddress2 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';
const testMemberAddress3 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';
const testContractOwner = '0xd728cee2648a642fda9dc1218d2d5746848400ba';
const testContractAddress = '0x78bb290147d001be464491315d991ded1f248d8a';
const accountPassword = 'meetup';
const meetupToken = new transferableToken_1.default("ws://localhost:8647", testContractOwner, testContractAddress, accountPassword);
function testDeployContract() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // TODO this has not yet been implemented in web3 1.0
            //await meetupToken.unlockAccount(accountPassword);
            const contractAddress = yield meetupToken.deployContract(testContractOwner);
            console.log(`Successfully deployed transferable meetup token to contract address: ${contractAddress}`);
        }
        catch (err) {
            console.log(`Failed to deploy a transferable meetup token. Error: ${err.message}`);
        }
    });
}
testDeployContract();
function testEvents() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const newMeetupToken = new transferableToken_1.default("ws://localhost:8647", testContractOwner, null, 
            //testContractAddress,
            accountPassword);
            // TODO this has not yet been implemented in web3 1.0
            //await newMeetupToken.unlockAccount(accountPassword);
            const contractAddress = yield newMeetupToken.deployContract(testContractOwner);
            console.log(`New deployed transferable meetup token contract address: ${contractAddress}`);
            const transactionsHash1 = yield newMeetupToken.issueTokens(testMemberAddress1, 10, "123456789", 'newMember');
            console.log(`Issue tokens hash ${transactionsHash1}`);
            const transactionsHash2 = yield newMeetupToken.issueTokens(testMemberAddress1, 20, "123456789", 'attendEvent');
            const transactionsHash3 = yield newMeetupToken.issueTokens(testMemberAddress1, 30, "123456789", 'speakAtEvent');
            console.log(`Transaction hashes from tokens issued to first address: ${transactionsHash1} ${transactionsHash2} ${transactionsHash3}`);
            yield newMeetupToken.issueTokens(testMemberAddress2, 10, "987654321", 'newMember');
            yield newMeetupToken.issueTokens(testMemberAddress3, 20, "987654321", 'attendEvent');
            yield newMeetupToken.issueTokens(testMemberAddress3, 20, "111111111", 'attendEvent');
            console.log(`Tokens issued to second address`);
            const externalIdsFromAllEvents = yield newMeetupToken.getIssueEvents();
            console.log(`Got ${externalIdsFromAllEvents.length} unique external ids all Issue events`);
            const externalIdsFromNewMemberEvents = yield newMeetupToken.getIssueEvents('newMember');
            console.log(`Got ${externalIdsFromNewMemberEvents.length} unique external ids from newMember Issue events`);
            assert.equal(externalIdsFromAllEvents.length, 3);
            assert.equal(externalIdsFromNewMemberEvents.length, 2);
        }
        catch (err) {
            console.log(`Failed events tests. Error: ${err.message}`);
        }
    });
}
testEvents();
function testExistingContractIssue() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbol = yield meetupToken.getSymbol();
            console.log(`symbol = ${symbol}`);
            const name = yield meetupToken.getName();
            console.log(`name = ${name}`);
            const totalSupply = yield meetupToken.getTotalSupply();
            console.log(`total supply = ${totalSupply}`);
            const testMemberBalance1BeforeIssue = yield meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance before issue = ${testMemberBalance1BeforeIssue}`);
            let testMemberBalance2 = yield meetupToken.getBalanceOf(testMemberAddress2);
            console.log(`second member balance before issue = ${testMemberBalance2}`);
            const transactionsHash1 = yield meetupToken.issueTokens(testMemberAddress1, 111, "123456789", 'newMember');
            console.log(`Transaction hash from token issue: ${transactionsHash1}`);
            const transactionsHash2 = yield meetupToken.issueTokens(testMemberAddress2, 222, "987654321", 'newMember');
            console.log(`Transaction hash from token issue: ${transactionsHash2}`);
            const testMemberBalance1AfterIssue = yield meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance after issue = ${testMemberBalance1AfterIssue}`);
            assert.equal(testMemberBalance1AfterIssue, testMemberBalance1BeforeIssue + 111);
            const transactionsHash3 = yield meetupToken.redeemTokens(testMemberAddress1, 11);
            console.log(`Transaction hash from token redeem: ${transactionsHash3}`);
            const testMemberBalance1AfterRedeem = yield meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance after redeem = ${testMemberBalance1AfterRedeem}`);
            assert.equal(testMemberBalance1AfterRedeem, testMemberBalance1BeforeIssue + 111 - 11);
        }
        catch (err) {
            console.log(`Failed testExistingContractIssue. Error: ${err.message}`);
        }
    });
}
testExistingContractIssue();
//# sourceMappingURL=testTransferableToken.js.map