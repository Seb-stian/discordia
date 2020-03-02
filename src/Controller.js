const Discord = require('discord.js');
const Command = require('./Command');
const fama = require('fama');
const fs = require('fs');
const types = require('./adventure-types');

module.exports = class Controller {

    /**
     * @param {Discord.Client} client 
     * @param {GeneralSettings} settings 
     */
    constructor(client, settings) {
        this.generalSettings = settings;
        this.client = client;

        /**
         * @type {Array<Command>}
         */
        this.commands = [];

        /**
         * @type {types.Adventure}
         */
        this.adventure;

        fs.stat('./src/commands', (error, stats) => {
            if (!error && stats.isDirectory()) {
                const commandFiles = fs.readdirSync('./src/commands');
                for (let i = 0; i < commandFiles.length; i++) {
                    const exportedClass = require(`./commands/${commandFiles[i]}`);
                    this.commands.push(new exportedClass());
                }
                for (let i = 0; i < this.commands.length; i++) {
                    if (this.commands[i]['onCommandsLoaded']) {
                        this.commands[i].onCommandsLoaded(this.commands);
                        break;
                    }
                }
                fama.info('Commands loaded!');
            }
        });

        this.loadAdventure();
        client.on('message', message => this.onMessage(message));
    }

    loadAdventure() {
        const path = `./adventures/${this.generalSettings.adventure}/adventure.json`;
        try {
            this.adventure = JSON.parse(fs.readFileSync(path, { encoding: 'utf8' }));
        }
        catch (e) {
            fama.error(`Failed parsing adventures/${this.generalSettings.adventure}/adventure.json contents: ${e.message}`);
            process.exit(1);
        }

        if (typeof this.adventure['name'] !== 'string') {
            fama.error('Adventure must have a "name" property of type string.');
            process.exit(1);
        }
        if (!Array.isArray(this.adventure['locations']) || this.adventure.locations.length < 1) {
            fama.error('Adventure must contain at least one location.');
            process.exit(1);
        }
        fama.info('Adventure loaded!');
    }

    /**
     * @param {Discord.Message} message 
     */
    onMessage(message) {
        if (message.author.bot) {
            return;
        }

        if (!message.content.startsWith(this.generalSettings.prefix)) {
            return;
        }

        let allowedChannel = false;
        for (let i = 0; i < this.generalSettings.channels.length; i++) {
            if (message.channel.name === this.generalSettings.channels[i] || message.channel.id === this.generalSettings.channels[i]) {
                allowedChannel = true;
                break;
            }
        }
        if (!allowedChannel) {
            return;
        }

        const parts = message.content.substring(0).split(/(\s+|\n)/g, 2);

        for (let i = 0; i < this.commands.length; i++) {
            if (this.commands[i].command === parts[0].toLowerCase()) {
                if (this.commands[i]._ready) {
                    if (!this.commands[i].adminOnly || message.member.hasPermission('ADMINISTRATOR')) {
                        this.commands[i].onCall(message, this);
                    }
                }
                break;
            }
        }
    }

}

/**
 * @typedef GeneralSettings
 * @property {string} adventure
 * @property {string} prefix
 * @property {Array<string>} channels
 * @property {boolean} logs
 */