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
const MeetupApi = require("meetup-api");
const VError = require("verror");
const ethUtils_1 = require("./ethUtils");
const logger = require("config-logger");
class Meetup {
    constructor(apiKey, urlname) {
        this.apiKey = apiKey;
        this.urlname = urlname;
        this.pageSize = 200;
        this.apiLimit = 5;
        this.extractAddressFromText = ethUtils_1.extractEthAddress;
        this.meetup = new MeetupApi({ key: apiKey });
        logger.debug(`Instanciated Meetup`);
    }
    getMemberNumbers() {
        const self = this;
        return new Promise((resolve, reject) => {
            self.meetup.getGroup({
                'urlname': this.urlname
            }, function (err, response) {
                if (err) {
                    const error = new VError(`Get member numbers for meetup ${self.urlname} returned error: ${err}`);
                    logger.error(error.stack);
                    return reject(error);
                }
                else {
                    logger.info(`${response.members} members in the ${self.urlname} group`);
                    self.memberNumber = response.members;
                    resolve(response.members);
                }
            });
        });
    }
    extractMemberAddresses() {
        return __awaiter(this, void 0, void 0, function* () {
            const self = this;
            let memberAddresses = [];
            try {
                const members = yield this.getMemberNumbers();
                const pages = Math.round(members / this.pageSize);
                for (let page = 0; page <= pages; page++) {
                    const newMemberAddresses = yield self.extractMemberAddressesFromPage(page);
                    memberAddresses = memberAddresses.concat(newMemberAddresses);
                }
                return memberAddresses;
            }
            catch (err) {
                const error = new VError(err, `could not extract member addresses`);
                logger.error(error.stack);
                throw error;
            }
        });
    }
    extractMemberAddressesFromPage(offset) {
        const self = this;
        return new Promise((resolve, reject) => {
            this.meetup.getMemberProfiles({
                'urlname': this.urlname,
                "page": this.pageSize,
                "offset": offset
            }, function (err, memberProfiles) {
                if (err) {
                    const error = new VError(`Get member profiles for meetup ${self.urlname}, page ${this.page} and offset ${offset} returned error: ${err}`);
                    logger.error(error.stack);
                    return reject(error);
                }
                else {
                    logger.trace(memberProfiles);
                    logger.info(`${memberProfiles.length} members returned for page offset ${offset} and page size ${self.pageSize}`);
                    let memberAddresses = [];
                    memberProfiles.forEach((memberProfile) => {
                        const memberAddress = self.getMemberAddressFromProfile(memberProfile);
                        if (memberAddress) {
                            memberAddresses.push(memberAddress);
                        }
                    });
                    resolve(memberAddresses);
                }
            });
        });
    }
    getMemberAddressFromProfile(memberProfile) {
        if (memberProfile && memberProfile.group_profile && memberProfile.group_profile.intro) {
            const address = this.extractAddressFromText(memberProfile.group_profile.intro);
            if (address) {
                return {
                    id: memberProfile.id,
                    address: address
                };
            }
        }
    }
    getMembersAtEvent(event_id) {
        const self = this;
        const description = `event RSVPs for ${self.urlname} Meetup event with id ${event_id}`;
        return new Promise((resolve, reject) => {
            self.meetup.getEventRSVPs({
                'urlname': self.urlname,
                "event_id": event_id
            }, function (err, rsvps) {
                if (err) {
                    const error = new VError(`Get ${description} returned error: ${err}`);
                    logger.error(error.stack);
                    return reject(error);
                }
                else if (!rsvps || !Array.isArray(rsvps)) {
                    const error = new VError(`Get ${description} did not return a response that was an Array`);
                    logger.error(error.stack);
                    return reject(error);
                }
                else {
                    logger.trace(rsvps);
                    logger.debug(`Returned ${rsvps.length} ${description}`);
                    const rsvpMembers = [];
                    rsvps.forEach(rsvp => {
                        if (rsvp.response == 'yes' && rsvp.member && rsvp.member.id) {
                            rsvpMembers.push(rsvp.member.id.toString());
                        }
                    });
                    logger.debug(`${rsvpMembers.length} ${description}`);
                    resolve(rsvpMembers);
                }
            });
        });
    }
}
exports.default = Meetup;
//# sourceMappingURL=meetup.js.map