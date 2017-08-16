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
// there is no type definition file for the meetup-api module so the following will error
const meetup_1 = require("./meetup");
const token_1 = require("./token");
const VError = require("verror");
const logger = require("config-logger");
const _ = require("underscore");
class MeetupToken {
    constructor(options) {
        // amount of tokens to be issued to a member for doing something
        this.issueAmounts = {
            newMember: 10,
            attendEvent: 20,
            speakAtEvent: 30,
            hostEvent: 50,
            sponsorEvent: 100
        };
        this.meetup = new meetup_1.default(options.apiKey, options.urlname);
        this.token = new token_1.default(options.wsURL || "ws://localhost:8546", options.contractAddress, options.contractOwner);
    }
    issueTokensToNewMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            try {
                // get the list of members who have already received tokens in the past
                const existingTokenHolders = yield this.token.getIssuedMembers();
                logger.debug(`${existingTokenHolders.length} members who have already received tokens in the past`);
                // get the list of members who have addresses in their Meetup intro
                const membersWithAddresses = yield this.meetup.extractMemberAddresses();
                logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);
                // get the list of members who have not yet been issued tokens
                const newMembersWithAddresses = _.filter(membersWithAddresses, memberWithAddress => {
                    // select the members who have not already been issued tokens
                    return !_.contains(existingTokenHolders, existingTokenHolder => {
                        memberWithAddress.id == existingTokenHolder;
                    });
                });
                logger.debug(`${newMembersWithAddresses.length} members who have not yet been issued tokens`);
                for (let newMemberWithAddresses of newMembersWithAddresses) {
                    yield this.token.issueTokens(newMemberWithAddresses.id, newMemberWithAddresses.address, this.issueAmounts['newMember']);
                }
                logger.info(`Issued tokens to ${newMembersWithAddresses.length} new members`);
            }
            catch (err) {
                const error = new VError(err, `Could not issue tokens to new meetup members`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    issueTokensToMembersAtEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get list of members who attended a meetup event
                const membersAtEvent = yield this.meetup.getMembersAtEvent(eventId);
                logger.debug(`${membersAtEvent.length} members attended the Meetup event with id ${eventId}`);
                // get list of members who have addresses in their meetup intro
                const membersWithAddresses = yield this.meetup.extractMemberAddresses();
                logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);
                // get list of members with addresses who were at the meetup event
                const membersWithAddressesAtEvent = MeetupToken.filterMembersWithAddresses(membersWithAddresses, membersAtEvent);
                logger.debug(`${membersWithAddressesAtEvent.length} members at the event with ${eventId} has an address`);
                // for each member, issue a token
                for (let memberWithAddressesAtEvent of membersWithAddressesAtEvent) {
                    yield this.token.issueTokens(memberWithAddressesAtEvent.id, memberWithAddressesAtEvent.address, this.issueAmounts['attendEvent']);
                }
                logger.info(`Issued tokens to ${membersWithAddressesAtEvent.length} new members`);
            }
            catch (err) {
                const error = new VError(err, `Could not issue tokens to members at ${this.meetup.urlname} Meetup event with id ${eventId}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    issueTokensToMembers(memberMeetupIds, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get list of members who have addresses in their meetup intro
                const membersWithAddresses = yield this.meetup.extractMemberAddresses();
                logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);
                // get list of members with addresses who are to be issued tokens
                const membersWithAddressesToIssue = MeetupToken.filterMembersWithAddresses(membersWithAddresses, memberMeetupIds);
                logger.debug(`${membersWithAddressesToIssue.length} of ${memberMeetupIds.length} members to be issued tokens have an address`);
                // for each member, issue a token
                for (let memberWithAddressesToIssue of membersWithAddressesToIssue) {
                    yield this.token.issueTokens(memberWithAddressesToIssue.id, memberWithAddressesToIssue.address, amount);
                }
                logger.info(`Issued tokens to ${membersWithAddressesToIssue.length} new members`);
            }
            catch (err) {
                const error = new VError(err, `Could not issue ${amount} tokens to members with ids: ${memberMeetupIds}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    static filterMembersWithAddresses(membersWithAddresses, members) {
        const membersWithAddressesAtEvent = [];
        for (let memberWithAddress of membersWithAddresses) {
            for (let member of members) {
                if (memberWithAddress.id == member) {
                    membersWithAddressesAtEvent.push(memberWithAddress);
                    break;
                }
            }
        }
        return membersWithAddressesAtEvent;
    }
}
exports.default = MeetupToken;
//# sourceMappingURL=MeetupToken.js.map