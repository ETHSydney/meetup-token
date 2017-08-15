"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const process = require("process");
const meetup_1 = require("../src/meetup");
assert(process.env.MEETUP_KEY, 'MEETUP_KEY variable isn\'t set on enviroment');
const meetup = new meetup_1.default(process.env.MEETUP_KEY, 'SydEthereum');
// async function testExtractMemberAddressesFromPage(): Promise<void>
// {
//     try {
//         const memberAddresses: object[] = await meetup.extractMemberAddressesFromPage(0);
//         console.log(memberAddresses);
//     }
//     catch (err) {
//         console.log(`test catch error: ${err}`);
//     }
// }
// testExtractMemberAddressesFromPage().
//     catch((err) => {
//     console.log(`second catch error: ${err}`);
// });
meetup.extractMemberAddresses()
    .then(memberAddresses => {
    console.log(memberAddresses);
})
    .catch(err => {
    console.log(`test Error: ${err}`);
});
meetup.getMembersAtEvent(237360133)
    .then(memberIds => {
    console.log(memberIds);
})
    .catch(err => {
    console.log(`test Error: ${err}`);
});
//# sourceMappingURL=testMeetup.js.map