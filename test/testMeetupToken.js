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
const MeetupToken_1 = require("../src/MeetupToken");
assert(process.env.MEETUP_KEY, 'MEETUP_KEY variable isn\'t set on enviroment');
const meetupTokenOptions = {
    apiKey: process.env.MEETUP_KEY,
    urlname: 'SydEthereum',
    wsURL: "ws://localhost:8647",
    contractAddress: '0x5DafbBe70ece05c938862a8301882E81612b46b5',
    contractOwner: '0x8ae386892b59bd2a7546a9468e8e847d61955991'
};
const meetupToken = new MeetupToken_1.default(meetupTokenOptions);
function testIssueTokens() {
    return __awaiter(this, void 0, void 0, function* () {
        //await meetupToken.issueTokensToNewMembers();
        //await meetupToken.issueTokensToMembersAtEvent(237360125);
        //await meetupToken.issueTokensToMembers([71274432,196041355,1111,2223], 333);
        const members = yield meetupToken.token.getIssueEvents();
        console.log(`Members with issued tokens ${members}`);
    });
}
testIssueTokens();
//# sourceMappingURL=testMeetupToken.js.map