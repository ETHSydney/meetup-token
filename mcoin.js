#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const program = require("commander");
const MeetupToken_1 = require("./src/MeetupToken");
program
    .option('-k, --key <key>', 'Meetup API key')
    .option('-m, --meetupName <meetupName>', 'Meetup name. eg SydEthereum')
    .option('-o, --owner <owner>', 'Address of contract owner')
    .option('-c, --contract <contract>', 'Contract address of the Meetup token')
    .option('-b, --contractBlock <contractBlock>', 'Block the Meetup token contract was deployed')
    .option('-s, --symbol <symbol>', 'Symbol of the Mettup token (default "SET")')
    .option('-t, --tokenName <tokenName>', 'Name of the Meetup token (default "Transferable Sydney Ethereum Token")')
    .option('-o, --verbose <level>', '0 trace, 1 debug, 2 info, 3 warn, 4 error (default 2)')
    .option('-gp, --verbose <gasPrice>', 'gas price')
    .option('-gl, --verbose <gasLimit>', 'gas limit');
program
    .command('deploy')
    .description('deploy new Meetup token contract')
    .action(async function (command, eventId) {
    const meetupToken = initMeetupToken();
    const tokenConfig = loadTokenConfig();
    try {
        const contract = await meetupToken.deployTokenContract(tokenConfig.symbol, tokenConfig.tokenName);
        console.log(`Contract address for newly deployed meetup token is ${contract}`);
        process.exit();
    }
    catch (err) {
        console.error(`Could not deploy new contract for meetup. Error: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('members')
    .description('Issue tokens to new members of the Meetup')
    .action(async function (command, eventId) {
    const meetupToken = initMeetupToken();
    try {
        const newMembers = await meetupToken.issueTokensToNewMembers();
        console.log(`Tokens issued to ${newMembers.length} new members`);
        process.exit();
    }
    catch (err) {
        console.error(`Could not issue tokens to new members of the ${meetupToken.meetup.urlname} meetup. Error: ${err.message}`);
        process.exit(1);
    }
});
program
    .command('event <id>')
    .description('Issue tokens to members who attended a Meetup event with Meetup event id')
    .action(async (eventId) => {
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
// display help if no commands passed into program. The first 2 arguments are node and mcoin.js
if (process.argv.length < 3) {
    program.outputHelp();
    process.exit(2);
}
function loadMeetupConfig() {
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
    else if (!returnOptions.meetupName) {
        console.log(`Error: Meetup name must be set with the --name option or in the config/meetup.yaml config file. eg SydEthereum`);
        process.exit(1);
    }
    return returnOptions;
}
function loadTokenConfig() {
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
    if (!config.amounts) {
        config.amounts = {};
    }
    return {
        providerType: config.providerType || 'jsonrpc',
        providerParam1: config.providerParam1 || 'mainnet',
        providerParam2: config.providerParam2 || false,
        providerParam3: config.providerParam3 || 1,
        contractOwner: contractOwner,
        contractAddress: program.contract || config.contractAddress,
        contractAddressBlock: program.contractBlock || config.contractAddressBlock,
        symbol: program.symbol || config.symbol || 'SET',
        tokenName: program.tokenName || config.tokenName || 'Transferable Sydney Ethereum Token',
        gasLimit: program.gl || config.gasPrice || 100000,
        gasPrice: program.gp || config.gasPrice || 1000000000,
        issueAmounts: {
            newMember: program.newMember || config.issueAmounts.newMember || 1000,
            attendEvent: program.attendEvent || config.issueAmounts.attendEvent || 2000,
            speakAtEvent: program.speakAtEvent || config.issueAmounts.speakAtEvent || 3000,
            hostEvent: program.hostEvent || config.issueAmounts.hostEvent || 5000,
            sponsorEvent: program.sponsorEvent || config.issueAmounts.sponsorEvent || 10000
        }
    };
}
function initMeetupToken() {
    const meetupConfig = loadMeetupConfig();
    const tokenConfig = loadTokenConfig();
    return new MeetupToken_1.default({
        apiKey: meetupConfig.key,
        urlname: meetupConfig.meetupName,
        contractAddress: tokenConfig.contractAddress,
        contractAddressBlock: tokenConfig.contractAddressBlock,
        contractOwner: tokenConfig.contractOwner,
        providerType: tokenConfig.providerType,
        providerParam1: tokenConfig.providerParam1,
        providerParam2: tokenConfig.providerParam2,
        providerParam3: tokenConfig.providerParam3,
        issueAmounts: tokenConfig.issueAmounts
    });
}
//# sourceMappingURL=mcoin.js.map