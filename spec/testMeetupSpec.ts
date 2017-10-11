import * as assert from 'assert';
import * as process from 'process';
import Meetup from '../src/meetup';

assert(process.env.MEETUP_KEY, 'MEETUP_KEY variable isn\'t set on enviroment');

const meetup = new Meetup(process.env.MEETUP_KEY, 'SydEthereum');

describe("Test Meetup API", function()
{
    it("extract member addresses", async function(done)
    {
        try
        {
            const memberAddresses = await meetup.extractMemberAddresses();

            console.log(`${memberAddresses.length} meetup members has Ethereum addresses`);

            expect(memberAddresses).toBeDefined();
            expect(memberAddresses.length).toBeGreaterThan(0);
            done();
        }
        catch(err) {
            expect(err).not.toBeDefined();
            done();
            //done.fail(`Returned err ${err.toString()}`);
        }
    }, 30000);

    it("get members at event", async function(done)
    {
        try {
            const memberIds = await meetup.getMembersAtEvent(237360133);

            expect(memberIds).toBeDefined();
            expect(memberIds.length).toBeGreaterThan(0);
            done();
        }
        catch(err) {
            expect(err).toBeDefined();
            done();
            //done.fail(`Returned err ${err.toString()}`);
        }
    });
});