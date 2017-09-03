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
const process = require("process");
const meetup_1 = require("../src/meetup");
assert(process.env.MEETUP_KEY, 'MEETUP_KEY variable isn\'t set on enviroment');
const meetup = new meetup_1.default(process.env.MEETUP_KEY, 'SydEthereum');
describe("Test Meetup API", function () {
    it("extract member addresses", function (done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const memberAddresses = yield meetup.extractMemberAddresses();
                expect(memberAddresses).toBeDefined();
                expect(memberAddresses.length).toBeGreaterThan(0);
                done();
            }
            catch (err) {
                expect(err).not.toBeDefined();
                done();
                //done.fail(`Returned err ${err.toString()}`);
            }
        });
    }, 10000);
    it("get members at event", function (done) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const memberIds = yield meetup.getMembersAtEvent(237360133);
                expect(memberIds).toBeDefined();
                expect(memberIds.length).toBeGreaterThan(0);
                done();
            }
            catch (err) {
                expect(err).toBeDefined();
                done();
                //done.fail(`Returned err ${err.toString()}`);
            }
        });
    });
});
//# sourceMappingURL=testMeetupSpec.js.map