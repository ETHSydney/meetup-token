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
const transferableToken_1 = require("./transferableToken");
const VError = require("verror");
const logger = require("config-logger");
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
        this.contractAddress = options.contractAddress;
        this.contractAddressBlock = options.contractAddressBlock;
        this.contractOwner = options.contractOwner;
        if (options.issueAmounts) {
            this.issueAmounts = options.issueAmounts;
        }
        try {
            this.token = new transferableToken_1.default(options.wsURL || "ws://localhost:8546", options.contractOwner, options.contractAddress);
        }
        catch (err) {
            const error = new VError(err, `Could not connect to Ethereum node using websocket address ${options.wsURL}`);
            logger.error(error.stack);
            throw error;
        }
    }
    deployTokenContract(symbol, tokenName) {
        return __awaiter(this, void 0, void 0, function* () {
            const description = `a new meetup token with symbol ${symbol} and token name ${tokenName}`;
            try {
                this.contractAddress = yield this.token.deployContract(this.contractOwner, symbol, tokenName);
                logger.info(`Successfully deployed to address ${this.contractAddress} ${description}`);
                return this.contractAddress;
            }
            catch (err) {
                const error = new VError(err, `Could not deploy ${description}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    issueTokensToNewMembers() {
        return __awaiter(this, void 0, void 0, function* () {
            const reason = 'newMember';
            try {
                // get the list of members who have already received tokens in the past
                const existingTokenHolders = yield this.token.getIssueEvents(reason, this.contractAddressBlock);
                logger.debug(`${existingTokenHolders.length} members who have already received tokens in the past`);
                // get the list of members who have addresses in their Meetup intro
                const membersWithAddresses = yield this.meetup.extractMemberAddresses();
                logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);
                // get list of members with addresses who have not already been issued tokens
                const newMembersWithAddresses = MeetupToken.filterMembersWithAddressesNotInMembersFilter(membersWithAddresses, existingTokenHolders);
                logger.debug(`${newMembersWithAddresses.length} members who have not yet been issued tokens`);
                for (let newMemberWithAddresses of newMembersWithAddresses) {
                    yield this.token.issueTokens(newMemberWithAddresses.address, this.issueAmounts[reason], newMemberWithAddresses.id.toString(), reason);
                }
                logger.info(`Issued tokens to ${newMembersWithAddresses.length} new members`);
                return newMembersWithAddresses;
            }
            catch (err) {
                const error = new VError(err, `Failed to issue tokens to new meetup members`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    issueTokensToMembersAtEvent(eventId) {
        return __awaiter(this, void 0, void 0, function* () {
            const reason = 'attendEvent';
            try {
                // get the list of members who have already received tokens for attending an event
                const membersAlreadyIssuedTokensForReason = yield this.token.getIssueEvents(reason, this.contractAddressBlock);
                logger.debug(`${membersAlreadyIssuedTokensForReason.length} members who have already been issued tokens for reason ${reason}, event id ${eventId}`);
                // get list of members who attended the Meetup event
                const membersAtEvent = yield this.meetup.getMembersAtEvent(eventId);
                logger.debug(`${membersAtEvent.length} members attended the Meetup event with id ${eventId}`);
                // get members who have not already been issued tokens
                const membersToIssueTokens = membersAtEvent.filter(member => membersAlreadyIssuedTokensForReason.indexOf(member) == -1);
                return yield this.issueTokensToMembers(membersToIssueTokens, this.issueAmounts.attendEvent, reason);
            }
            catch (err) {
                const error = new VError(err, `Failed to issue tokens to members of the ${this.meetup.urlname} Meetup who attended event with id ${eventId}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    issueTokensToMembers(memberMeetupIds, amount, reason) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // get list of members who have addresses in their meetup intro
                const membersWithAddresses = yield this.meetup.extractMemberAddresses();
                logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);
                // get list of members with addresses who are to be issued tokens
                const membersWithAddressesToIssue = MeetupToken.filterMembersWithAddressesInMembersFilter(membersWithAddresses, memberMeetupIds);
                logger.debug(`${membersWithAddressesToIssue.length} of ${memberMeetupIds.length} members to be issued tokens have an address`);
                // for each member, issue a token
                for (let memberWithAddressesToIssue of membersWithAddressesToIssue) {
                    yield this.token.issueTokens(memberWithAddressesToIssue.address, amount, memberWithAddressesToIssue.id.toString(), reason);
                }
                logger.info(`Issued tokens to ${membersWithAddressesToIssue.length} new members`);
                return membersWithAddressesToIssue;
            }
            catch (err) {
                const error = new VError(err, `Failed to issue ${amount} tokens to members with ids: ${memberMeetupIds}`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    static filterMembersWithAddressesInMembersFilter(membersWithAddresses, membersFilter) {
        const membersWithAddressesInFilter = [];
        for (let memberWithAddress of membersWithAddresses) {
            for (let member of membersFilter) {
                if (memberWithAddress.id.toString() === member) {
                    membersWithAddressesInFilter.push(memberWithAddress);
                    break;
                }
            }
        }
        return membersWithAddressesInFilter;
    }
    static filterMembersWithAddressesNotInMembersFilter(membersWithAddresses, membersFilter) {
        const membersWithAddressesInFilter = [];
        for (let memberWithAddress of membersWithAddresses) {
            let found = false;
            for (let member of membersFilter) {
                if (memberWithAddress.id.toString() === member) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                membersWithAddressesInFilter.push(memberWithAddress);
            }
        }
        return membersWithAddressesInFilter;
    }
}
exports.default = MeetupToken;
//# sourceMappingURL=MeetupToken.js.map