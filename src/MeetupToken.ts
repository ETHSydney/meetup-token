// there is no type definition file for the meetup-api module so the following will error
import Meetup from './meetup';
import Token from './token';
import * as VError from 'verror';
import * as logger from 'config-logger';
import * as _ from 'underscore';
import {MemberAddress} from './meetup';

export interface IMeetupToken {
    apiKey: string,
    urlname: string,
    contractAddress: string,
    contractOwner: string,
    wsURL?: string
}

export default class MeetupToken
{
    meetup: Meetup;
    token: Token;

    // amount of tokens to be issued to a member for doing something
    issueAmounts: { [issueReason: string]: number} = {
        newMember: 10,
        attendEvent: 20,
        speakAtEvent: 30,
        hostEvent: 50,
        sponsorEvent: 100
    };

    constructor(options: IMeetupToken)
    {
        this.meetup = new Meetup(options.apiKey, options.urlname);

        this.token = new Token(
            options.wsURL || "ws://localhost:8546",
            options.contractAddress,
            options.contractOwner);
    }

    async issueTokensToNewMembers()
    {
        const self = this;

        try
        {
            // get the list of members who have already received tokens in the past
            const existingTokenHolders: number[] = await this.token.getIssuedMembers();

            logger.debug(`${existingTokenHolders.length} members who have already received tokens in the past`);

            // get the list of members who have addresses in their Meetup intro
            const membersWithAddresses: MemberAddress[] = await this.meetup.extractMemberAddresses();

            logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);

            // get the list of members who have not yet been issued tokens
            const newMembersWithAddresses: MemberAddress[] = _.filter(membersWithAddresses, memberWithAddress =>
            {
                // select the members who have not already been issued tokens
                return !_.contains(existingTokenHolders, existingTokenHolder =>
                {
                    memberWithAddress.id == existingTokenHolder;
                });
            });

            logger.debug(`${newMembersWithAddresses.length} members who have not yet been issued tokens`);

            for (let newMemberWithAddresses of newMembersWithAddresses)
            {
                await this.token.issueTokens(newMemberWithAddresses.id, newMemberWithAddresses.address, this.issueAmounts['newMember']);
            }

            logger.info(`Issued tokens to ${newMembersWithAddresses.length} new members`);
        }
        catch (err)
        {
            const error = new VError(err, `Could not issue tokens to new meetup members`);
            logger.error(error.stack);
            throw error;
        }
    }

    async issueTokensToMembersAtEvent(eventId: number)
    {
        try
        {
            // get list of members who attended a meetup event
            const membersAtEvent: number[] = await this.meetup.getMembersAtEvent(eventId);

            logger.debug(`${membersAtEvent.length} members attended the Meetup event with id ${eventId}`);

            // get list of members who have addresses in their meetup intro
            const membersWithAddresses: MemberAddress[] = await this.meetup.extractMemberAddresses();

            logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);

            // get list of members with addresses who were at the meetup event
            const membersWithAddressesAtEvent = MeetupToken.filterMembersWithAddresses(membersWithAddresses, membersAtEvent);

            logger.debug(`${membersWithAddressesAtEvent.length} members at the event with ${eventId} has an address`);

            // for each member, issue a token
            for (let memberWithAddressesAtEvent of membersWithAddressesAtEvent)
            {
                await this.token.issueTokens(memberWithAddressesAtEvent.id, memberWithAddressesAtEvent.address, this.issueAmounts['attendEvent']);
            }

            logger.info(`Issued tokens to ${membersWithAddressesAtEvent.length} new members`);
        }
        catch (err)
        {
            const error = new VError(err, `Could not issue tokens to members at ${this.meetup.urlname} Meetup event with id ${eventId}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async issueTokensToMembers(memberMeetupIds: number[], amount: number)
    {
        try
        {
            // get list of members who have addresses in their meetup intro
            const membersWithAddresses: MemberAddress[] = await this.meetup.extractMemberAddresses();

            logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);

            // get list of members with addresses who are to be issued tokens
            const membersWithAddressesToIssue = MeetupToken.filterMembersWithAddresses(membersWithAddresses, memberMeetupIds);

            logger.debug(`${membersWithAddressesToIssue.length} of ${memberMeetupIds.length} members to be issued tokens have an address`);

            // for each member, issue a token
            for (let memberWithAddressesToIssue of membersWithAddressesToIssue)
            {
                await this.token.issueTokens(memberWithAddressesToIssue.id, memberWithAddressesToIssue.address, amount);
            }

            logger.info(`Issued tokens to ${membersWithAddressesToIssue.length} new members`);
        }
        catch (err)
        {
            const error = new VError(err, `Could not issue ${amount} tokens to members with ids: ${memberMeetupIds}`);
            logger.error(error.stack);
            throw error;
        }
    }

    private static filterMembersWithAddresses(membersWithAddresses: MemberAddress[], members: number[]): MemberAddress[]
    {
        const membersWithAddressesAtEvent: MemberAddress[] = [];
        for (let memberWithAddress of membersWithAddresses)
        {
            for (let member of members)
            {
                if (memberWithAddress.id == member)
                {
                    membersWithAddressesAtEvent.push(memberWithAddress);
                    break;
                }
            }
        }

        return membersWithAddressesAtEvent;
    }
}