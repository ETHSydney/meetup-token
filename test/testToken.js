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
const token_1 = require("../src/token");
const testMemberAddress1 = '0xf55583ff8461db9dfbbe90b5f3324f2a290c3356';
const testMemberAddress2 = '0x7dcb9490316fc555b1ca8bc0db609ad4846b864b';
const testContractOwner = '0x8ae386892b59bd2a7546a9468e8e847d61955991';
const testContractAddress = '0x3D7bb122F0BddD971eDf355CFc9D26640313D4D2';
const accountPassword = 'meetup';
const meetupToken = new token_1.default("ws://localhost:8647", testContractAddress, testContractOwner, accountPassword);
function testDeployContract() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // TODO this has not yet been implemented in web3 1.0
            //await meetupToken.unlockAccount(accountPassword);
            const contractAddress = yield meetupToken.deployContract(testContractOwner);
            console.log(`New deployed transferable meetup token contract address: ${contractAddress}`);
        }
        catch (err) {
            console.log(`Failed to deploy a transferable meetup token. Error: ${err.message}`);
        }
    });
}
testDeployContract();
function testExistingContractIssue() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const symbol = yield meetupToken.getSymbol();
            console.log(`symbol = ${symbol}`);
            const name = yield meetupToken.getName();
            console.log(`name = ${name}`);
            const totalSupply = yield meetupToken.getTotalSupply();
            console.log(`total supply = ${totalSupply}`);
            let testMemberBalance1 = yield meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance before issue = ${testMemberBalance1}`);
            let testMemberBalance2 = yield meetupToken.getBalanceOf(testMemberAddress2);
            console.log(`second member balance before issue = ${testMemberBalance2}`);
            const transactionsHash1 = yield meetupToken.issueTokens(123456789, testMemberAddress1, 111);
            console.log(`Transaction hash from token issue: ${transactionsHash1}`);
            const transactionsHash2 = yield meetupToken.issueTokens(987654321, testMemberAddress2, 222);
            console.log(`Transaction hash from token issue: ${transactionsHash2}`);
            testMemberBalance1 = yield meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance after issue = ${testMemberBalance1}`);
            const transactionsHash3 = yield meetupToken.redeemTokens(testMemberAddress1, 11);
            console.log(`Transaction hash from token redeem: ${transactionsHash3}`);
            testMemberBalance1 = yield meetupToken.getBalanceOf(testMemberAddress1);
            console.log(`first member balance after redeem = ${testMemberBalance1}`);
        }
        catch (err) {
            console.log(`Failed testExistingContractIssue. Error: ${err.message}`);
        }
    });
}
//testExistingContractIssue();
// meetupToken.getIssuedMembers()
//     .then(memberIds => {console.log(`Meetup members that have been issued a token: ${memberIds}`);})
//     .catch(err => {console.log(`Failed to get issued members. Error: ${err.message}`);});
//# sourceMappingURL=testToken.js.map