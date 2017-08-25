// there is no type definition file for the meetup-api module so the following will error
import * as MeetupApi from 'meetup-api';
import * as VError from 'verror';
import {extractEthAddress} from './ethUtils';
import * as logger from 'config-logger';

export interface MemberAddress {id: number, address: string}

declare type MeetupProfile = {
    id: number,
    group_profile: {
        intro?: string}
};

declare type MeetupApi = {
    getMemberProfiles: (options: object, callback: (err: Error, members: MeetupProfile[]) => void) => void,
    getGroup: (options: object, callback: (err: Error, rsvps: {members: number}) => void) => void,
    getEventRSVPs: (options: object, callback: (err: Error, rsvps: {rsvps: object[]}) => void) => void
};

export default class Meetup {

    readonly meetup: MeetupApi;
    pageSize: number = 200;
    apiLimit: number = 5;
    memberNumber: number;

    extractAddressFromText: (text: string)=> string | void = extractEthAddress;

    constructor(readonly apiKey: string, readonly urlname: string) {
        this.meetup = new MeetupApi({key: apiKey});

        logger.debug(`Instantiated MeetupApi`);
    }

    getMemberNumbers(): Promise<number>
    {
        const self = this;

        return new Promise<number>(
            (resolve: (memberNumer: number) => void, reject: any) =>
            {
                self.meetup.getGroup({
                    'urlname': this.urlname
                }, function(err: Error, response: {members: number})
                {
                    if (err)
                    {
                        const error = new VError(`Get member numbers for meetup ${self.urlname} returned error: ${err}`);
                        logger.error(error.stack);
                        return reject(error);
                    }
                    else
                    {
                        logger.info(`${response.members} members in the ${self.urlname} group`);

                        self.memberNumber = response.members;

                        resolve(response.members);
                    }
                });
            }
        );
    }

    async extractMemberAddresses(): Promise<MemberAddress[]>
    {
        const self = this;
        let memberAddresses: MemberAddress[] = [];

        try
        {
            const members = await this.getMemberNumbers();

            const pages = Math.round(members / this.pageSize);

            for(let page = 0; page <= pages; page++)
            {
                const newMemberAddresses = await self.extractMemberAddressesFromPage(page);
                memberAddresses = memberAddresses.concat(newMemberAddresses);
            }

            return memberAddresses;
        }
        catch(err) {
            const error = new VError(err, `could not extract member addresses`);
            logger.error(error.stack);
            throw error;
        }
    }

    extractMemberAddressesFromPage(offset: number): Promise<MemberAddress[]>
    {
        const self = this;

        return new Promise<MemberAddress[]>((resolve: (result?: MemberAddress[]) => void, reject: (error: Error) => void) =>
        {
            this.meetup.getMemberProfiles({
                'urlname': this.urlname,
                "page": this.pageSize,
                "offset": offset
            }, function(err: Error, memberProfiles: MeetupProfile[])
            {
                if (err)
                {
                    const error = new VError(`Get member profiles for meetup ${self.urlname}, page ${this.page} and offset ${offset} returned error: ${err}`);
                    logger.error(error.stack);
                    return reject(error);
                }
                else
                {
                    logger.trace(memberProfiles);
                    logger.info(`${memberProfiles.length} members returned for page offset ${offset} and page size ${self.pageSize}`);

                    let memberAddresses: MemberAddress[] = [];

                    memberProfiles.forEach((memberProfile) =>
                    {
                        const memberAddress = self.getMemberAddressFromProfile(memberProfile);

                        if (memberAddress) {
                            logger.debug(`Member ${memberAddress.id} has address ${memberAddress.address}`);
                            memberAddresses.push(memberAddress);
                        }
                    });

                    resolve(memberAddresses);
                }
            });
        });
    }

    getMemberAddressFromProfile(memberProfile: MeetupProfile): void | MemberAddress
    {
        if (memberProfile && memberProfile.group_profile && memberProfile.group_profile.intro)
        {
            const address = this.extractAddressFromText(memberProfile.group_profile.intro);

            if (address) {
                return {
                    id: memberProfile.id,
                    address: address
                };
            }
        }
    }

    getMembersAtEvent(event_id: number): Promise<string[]>
    {
        const self = this;

        const description = `event RSVPs for ${self.urlname} Meetup event with id ${event_id}`;

        return new Promise<string[]>((resolve: (result?: string[]) => void, reject: (err: Error) => void) =>
        {
            self.meetup.getEventRSVPs({
                'urlname': self.urlname,
                "event_id": event_id
            },
            function(err: Error, rsvps: object[])
            {
                if (err) {
                    const error = new VError(`Get ${description} returned error: ${err}`);
                    logger.error(error.stack);
                    return reject(error);
                }
                else if (!rsvps || !Array.isArray(rsvps))
                {
                    const error = new VError(`Get ${description} did not return a response that was an Array`);
                    logger.error(error.stack);
                    return reject(error);
                }
                else
                {
                    logger.trace(rsvps);
                    logger.debug(`Returned ${rsvps.length} ${description}`);

                    const rsvpMembers: string[] = [];

                    rsvps.forEach(rsvp =>
                    {
                        if (rsvp.response == 'yes' && rsvp.member && rsvp.member.id )
                        {
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
