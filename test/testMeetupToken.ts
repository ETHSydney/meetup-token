import * as assert from 'assert';
import MeetupToken from '../src/MeetupToken';

assert(process.env.MEETUP_KEY, 'MEETUP_KEY variable isn\'t set on enviroment');

const meetupTokenOptions = {
    apiKey: process.env.MEETUP_KEY,
    urlname: 'SydEthereum',
    wsURL: "ws://localhost:8647",
    contractAddress: '0x3D7bb122F0BddD971eDf355CFc9D26640313D4D2',
    contractOwner:'0x8ae386892b59bd2a7546a9468e8e847d61955991'
};

const meetupToken = new MeetupToken(meetupTokenOptions);

async function testIssueTokens()
{
    await meetupToken.issueTokensToNewMembers();

    await meetupToken.issueTokensToMembersAtEvent(237360125);

    await meetupToken.issueTokensToMembers([71274432,196041355,1111,2223], 333);
}

testIssueTokens();