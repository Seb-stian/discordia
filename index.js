'use strict';

const Discord = require('discord.js');
const fama = require('fama'); // logging utility
const fs = require('fs');

const client = new Discord.Client();

client.on('ready', () => {
  fama.info(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.reply('pong');
  }
});

/* Gets token from secret/token.json and logs in the client */
if (fs.existsSync('./secret/token.json')) {
  let tokenObject;
  try {
    tokenObject = JSON.parse(fs.readFileSync('./secret/token.json'));
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
    client.login(tokenObject['token']).catch(reason => {
      fama.error(`Discord client couldn't login: ${reason}`);
      process.exit(1);
    });
  }
}
else {
  fama.error('There must be a folder "secret" containing "token.json" with your discord bot token (named simply "token").');
  process.exit(1);
}