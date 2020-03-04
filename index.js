'use strict';

const Discord = require('discord.js');
const Controller = require('./src/Controller');
const fama = require('fama'); // logging utility
const fs = require('fs');

const client = new Discord.Client();

client.on('ready', () => {
    fama.info(`Logged in as ${client.user.tag}!`);
});

client.on('disconnect', () => {
    fama.info('Client has disconnected.');
});

client.on('error', (error) => {
    fama.error(`Client has thrown error with message: ${error.message}`);
});

let settingsObject;

/* Checks if settings.json exists and is valid */
if (fs.existsSync('./settings.json')) {
    try {
        settingsObject = JSON.parse(fs.readFileSync('./settings.json', {encoding: 'utf8'}));
    }
    catch (e) {
        fama.error(`Failed parsing settings.json contents: ${e.message}`);
        process.exit(1);
    }

    if (settingsObject['adventure'] == null) {
        fama.error('Missing "adventure" property in settings.json');
        process.exit(1);
    }
    else if (typeof settingsObject['adventure'] !== 'string') {
        fama.error(`settings.json contains property "adventure" of type ${typeof settingsObject['adventure']}, but string was expected.`);
        process.exit(1);
    }
    else if (!fs.existsSync(`./adventures/${settingsObject['adventure']}/adventure.json`)) {
        fama.error(`Missing file adventures/${settingsObject['adventure']}/adventure.json`);
        process.exit(1);
    }

    if (!settingsObject['prefix']) settingsObject['prefix'] = '';
    if (!settingsObject['channels']) settingsObject['channels'] = [];
    if (!settingsObject['logs']) settingsObject['logs'] = false;
}
else {
    fama.error('Missing file setting.json');
    process.exit(1);
}

let tokenObject;

/* Gets token from secret/token.json and logs in the client */
if (fs.existsSync('./secret/token.json')) {
    try {
        tokenObject = JSON.parse(fs.readFileSync('./secret/token.json', {encoding: 'utf8'}));
    }
    catch (e) {
        fama.error(`Failed parsing secret/token.json contents: ${e.message}`);
        process.exit(1);
    }
    if (tokenObject['token'] == null) {
        fama.error('secret/token.json doesn\'t contain "token" property or it is null.');
        process.exit(1);
    }
    else if (typeof tokenObject['token'] !== 'string') {
        fama.error(`secret/token.json contains property "token" of type ${typeof tokenObject['token']}, but string was expected.`);
        process.exit(1);
    }
    else {
        client.login(tokenObject['token']).then(() => {
            const controller = new Controller(client, settingsObject);
        }, (reason) => {
            fama.error(`Discord client couldn't login: ${reason}`);
            process.exit(1);
        });
    }
}
else {
    fama.error('There must be a folder "secret" containing "token.json" with your discord bot token (named simply "token").');
    process.exit(1);
}