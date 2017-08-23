#!/usr/bin/env node
import * as program from "commander";
import MeetupToken from "./src/MeetupToken";

program
    .option('-k, --key <key>', 'Meetup API key')
    .option('-m, --meetupName <meetupName>', 'Meetup name. eg SydEthereum')
    .option('-h, --wshost <wsHost>', 'Host of WS-RPC server listening interface (default: "localhost")')
    .option('-p, --wsport <wsPort>', 'Post of WS-RPC server listening interface (default: "8546")')
    .option('-o, --owner <owner>', 'Address of contract owner')
    .option('-c, --contract <contract>', 'Contract address of the Meetup token');

program
    .command('deploy')
    .description('deploy new Meetup token contract')
    .option('-s, --symbol <symbol>', 'Symbol of the Mettup token (default "SET")')
    .option('-t, --tokenName <tokenName>', 'Name of the Meetup token (default "Transferable Sydney Ethereum Token")')
    .action(async function(command, eventId)
    {
        const meetupToken = initMeetupToken();

        const tokenConfig = loadTokenConfig();

        try
        {
            const contract = await meetupToken.deployTokenContract(
                tokenConfig.symbol,
                tokenConfig.tokenName
            );

            console.log(`Contract address for newly deployed meetup token is ${contract}`);
            process.exit();
        }
        catch (err)
        {
            console.error(`Could not deploy new contract for meetup. Error: ${err.message}`);
            process.exit(1);
        }
    });

program
    .command('members')
    .description('Issue tokens to new members of the Meetup')
    .action(async function(command, eventId)
    {
        const meetupToken = initMeetupToken();

        try
        {
            const newMembers = await meetupToken.issueTokensToNewMembers();

            console.log(`Tokens issued to ${newMembers.length} new members`);
            process.exit();
        }
        catch (err)
        {
            console.error(`Could not issue tokens to new members of the ${meetupToken.meetup.urlname} meetup. Error: ${err.message}`);
            process.exit(1);
        }
    });

program
    .command('event <id>')
    .description('Issue tokens to members who attended a Meetup event with specified id')
    .action(async (eventId) =>
    {
        const meetupToken = initMeetupToken();

        if (!eventId) {
            console.error(`Error: id of the Meetup event must be an argument to the event.`);
            process.exit(1);
        }

        try {
            const members = await meetupToken.issueTokensToMembersAtEvent(eventId);

            console.log(`${members.length} members were issued tokens`);
            process.exit();
        }
        catch (err) {
            console.error(`Error: could not issue token to members that attended Meetup event with id ${eventId}.`);
            process.exit(1);
        }
    });

program.parse(process.argv);

function loadMeetupConfig(): {
    key: string,
    meetupName: string
}
{
    // set the NODE_ENV environment so the meetup config file can be loaded
    process.env.NODE_ENV = 'meetup';

    // load the meetup.yaml file in the config folder
    const config = require('config').util.loadFileConfigs();

    const returnOptions = {
        key: program.key || config.key,
        meetupName: program.meetupName || config.name
    };

    if (!returnOptions.key) {
        console.log(`Error: Meetup API key must be set with the --key option or in the config/meetup.yaml config file.`);
        console.log(`You can generate a Meetup API key at https://secure.meetup.com/meetup_api/key/`);
        process.exit(1);
    }
    else if (!returnOptions.meetupName)
    {
        console.log(`Error: Meetup name must be set with the --name option or in the config/meetup.yaml config file. eg SydEthereum`);
        process.exit(1);
    }

    return returnOptions;
}


function loadTokenConfig(): {
    wsurl: string,
    contractOwner: string,
    contractAddress?: string,
    symbol: string,
    tokenName: string
}
{
    // set the NODE_ENV environment so the token config file can be loaded
    process.env.NODE_ENV = 'token';

    // load the token.yaml file in the config folder
    const config = require('config').util.loadFileConfigs();

    // use the program options in preference to the configuration file
    const contractOwner = program.owner || config.contractOwner;

    if (!contractOwner) {
        console.log(`Error: owner of the token contract must be set with the --owner option or in the config/token.yaml config file.`);
        console.log(`The owner is the address that the contract was or will be created from. It's the externally owned account that is sending the Ethereum transaction.`);
        process.exit(1);
    }

    // use the program options in preference to the configuration file or geth defaults
    const wshost = program.wshost || config.wshost || 'localhost';
    const wsport = program.wsport || config.wsport || '8546';

    return {
        wsurl: `ws://${wshost}:${wsport.toString()}`,
        contractOwner: contractOwner,
        contractAddress: program.contract || config.contractAddress,
        symbol: program.symbol || config.symbol || 'SET',
        tokenName: program.tokenName || config.tokenName || 'Transferrable Sydney Ethereum Token'
    };
}

function initMeetupToken(): MeetupToken
{
    const meetupConfig = loadMeetupConfig();
    const tokenConfig = loadTokenConfig();

    return new MeetupToken({
        apiKey: meetupConfig.key,
        urlname: meetupConfig.meetupName,
        contractAddress: tokenConfig.contractAddress,
        contractOwner: tokenConfig.contractOwner,
        wsURL: tokenConfig.wsurl
    });
}
