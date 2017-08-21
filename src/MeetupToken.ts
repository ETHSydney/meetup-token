// there is no type definition file for the meetup-api module so the following will error
import Meetup from './meetup';
import Token from './transferableToken';
import * as VError from 'verror';
import * as logger from 'config-logger';
import * as _ from 'underscore';
import * as assert from 'assert';
import {MemberAddress} from './meetup';

export interface IMeetupToken {
    apiKey: string,
    urlname: string,
    contractAddress?: string,
    contractOwner: string,
    wsURL?: string
}

export default class MeetupToken
{
    meetup: Meetup;
    token: Token;

    contractAddress: string;
    contractOwner: string;

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

        this.contractAddress = options.contractAddress;
        this.contractOwner = options.contractOwner;

        this.token = new Token(
            options.wsURL || "ws://localhost:8546",
            options.contractOwner,
            options.contractAddress);
    }

    async deployTokenContract(symbol: string, tokenName: string): Promise<string>
    {
        const description = `a new meetup token with symbol ${symbol} and token name ${tokenName}`;
        try
        {
            this.contractAddress = await this.token.deployContract(this.contractOwner, symbol, tokenName);

            logger.info(`Successfully deployed to address ${this.contractAddress} ${description}`);

            return this.contractAddress;
        }
        catch (err)
        {
            const error = new VError(err, `Could not deploy ${description}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async issueTokensToNewMembers(): Promise<MemberAddress[]>
    {
        const reason = 'newMember';

        try
        {
            // get the list of members who have already received tokens in the past
            const existingTokenHolders: string[] = await this.token.getIssueEvents();

            logger.debug(`${existingTokenHolders.length} members who have already received tokens in the past`);

            // get the list of members who have addresses in their Meetup intro
            const membersWithAddresses: MemberAddress[] = await this.meetup.extractMemberAddresses();

            logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);

            // get list of members with addresses who have not already been issued tokens
            const newMembersWithAddresses = MeetupToken.filterMembersWithAddressesNotInMembersFilter(membersWithAddresses, existingTokenHolders);

            logger.debug(`${newMembersWithAddresses.length} members who have not yet been issued tokens`);

            for (let newMemberWithAddresses of newMembersWithAddresses)
            {
                await this.token.issueTokens(
                    newMemberWithAddresses.address,
                    this.issueAmounts[reason],
                    newMemberWithAddresses.id.toString(),
                    reason);
            }

            logger.info(`Issued tokens to ${newMembersWithAddresses.length} new members`);

            return newMembersWithAddresses;
        }
        catch (err)
        {
            const error = new VError(err, `Failed to issue tokens to new meetup members`);
            logger.error(error.stack);
            throw error;
        }
    }

    async issueTokensToMembersAtEvent(eventId: number): Promise<MemberAddress[]>
    {
        const reason = 'attendEvent';
        try
        {
            // get list of members who attended a meetup event
            const membersAtEvent: string[] = await this.meetup.getMembersAtEvent(eventId);

            logger.debug(`${membersAtEvent.length} members attended the Meetup event with id ${eventId}`);

            // get list of members who have addresses in their meetup intro
            const membersWithAddresses: MemberAddress[] = await this.meetup.extractMemberAddresses();

            logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);

            // get list of members with addresses who were at the meetup event
            const membersWithAddressesAtEvent = MeetupToken.filterMembersWithAddressesInMembersFilter(membersWithAddresses, membersAtEvent);

            logger.debug(`${membersWithAddressesAtEvent.length} members at the event with ${eventId} has an address`);

            // for each member, issue a token
            for (let memberWithAddressesAtEvent of membersWithAddressesAtEvent)
            {
                await this.token.issueTokens(
                    memberWithAddressesAtEvent.address,
                    this.issueAmounts[reason],
                    memberWithAddressesAtEvent.id.toString(),
                    reason);
            }

            logger.info(`Issued tokens to ${membersWithAddressesAtEvent.length} new members`);

            return membersWithAddressesAtEvent;
        }
        catch (err)
        {
            const error = new VError(err, `Failed to issue tokens to members at ${this.meetup.urlname} Meetup event with id ${eventId}`);
            logger.error(error.stack);
            throw error;
        }
    }

    async issueTokensToMembers(memberMeetupIds: string[], amount: number, reason: string): Promise<MemberAddress[]>
    {
        try
        {
            // get list of members who have addresses in their meetup intro
            const membersWithAddresses: MemberAddress[] = await this.meetup.extractMemberAddresses();

            logger.debug(`${membersWithAddresses.length} members who have addresses in their Meetup intro`);

            // get list of members with addresses who are to be issued tokens
            const membersWithAddressesToIssue = MeetupToken.filterMembersWithAddressesInMembersFilter(membersWithAddresses, memberMeetupIds);

            logger.debug(`${membersWithAddressesToIssue.length} of ${memberMeetupIds.length} members to be issued tokens have an address`);

            // for each member, issue a token
            for (let memberWithAddressesToIssue of membersWithAddressesToIssue)
            {
                await this.token.issueTokens(
                    memberWithAddressesToIssue.address,
                    amount,
                    memberWithAddressesToIssue.id.toString(),
                    reason);
            }

            logger.info(`Issued tokens to ${membersWithAddressesToIssue.length} new members`);

            return membersWithAddressesToIssue;
        }
        catch (err)
        {
            const error = new VError(err, `Failed to issue ${amount} tokens to members with ids: ${memberMeetupIds}`);
            logger.error(error.stack);
            throw error;
        }
    }

    static filterMembersWithAddressesInMembersFilter(membersWithAddresses: MemberAddress[], membersFilter: string[]): MemberAddress[]
    {
        const membersWithAddressesInFilter: MemberAddress[] = [];
        for (let memberWithAddress of membersWithAddresses)
        {
            for (let member of membersFilter)
            {
                if ( memberWithAddress.id.toString() === member )
                {
                    membersWithAddressesInFilter.push(memberWithAddress);
                    break;
                }
            }
        }

        return membersWithAddressesInFilter;
    }

    static filterMembersWithAddressesNotInMembersFilter(membersWithAddresses: MemberAddress[], membersFilter: string[]): MemberAddress[]
    {
        const membersWithAddressesInFilter: MemberAddress[] = [];
        for (let memberWithAddress of membersWithAddresses)
        {
            let found = false;
            for (let member of membersFilter)
            {
                if ( memberWithAddress.id.toString() === member )
                {
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
