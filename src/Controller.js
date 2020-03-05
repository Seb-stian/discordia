const Discord = require('discord.js');
const Command = require('./Command');
const loadAdventure = require('./adventure-loader');
const fama = require('fama');
const fs = require('fs');

module.exports = class Controller {

    /**
     * @param {Discord.Client} client 
     * @param {GeneralSettings} settings 
     */
    constructor(client, settings) {
        this.generalSettings = settings;
        this.client = client;

        fama.info('Loading adventure...');
        try {
            this.adventure = loadAdventure(this.generalSettings.adventure);
        }
        catch (e) {
            fama.error(`Adventure ${this.generalSettings.adventure} couldn't be loaded: ${e.message}`);
            process.exit(1);
        }
        fama.info('Adventure loaded!');

        /**
         * @type {Array<Command>}
         */
        this.commands = [];

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

        // get admin roles for command auth
        if (typeof this.generalSettings.adminRole === 'string') {
            this.generalSettings.adminRoles = this.client.guilds.cache
            .map(guild => guild.roles.cache.array())
            .map(roles => roles.find(role => role.name === this.generalSettings.adminRole || role.id === this.generalSettings.adminRole))
            .filter(role => role != null);
        }
        else {
            this.generalSettings.adminRole = null;
        }

        client.on('message', message => this.onMessage(message));
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

        // if the message was posted in the wrong channel
        if (!this.generalSettings.channels
            .some(identificator => identificator === message.channel.name ||
                                   identificator === message.channel.id))
                                   return;

        const parts = message.content.substring(0).split(/(\s+|\n)/g, 2);
        const isCallerAdmin = this.isAdmin(message.member);

        for (let i = 0; i < this.commands.length; i++) {
            if (this.commands[i].command === parts[0].toLowerCase()) {
                this.commands[i].onCall(message, this, isCallerAdmin);
                break;
            }
        }
    }

    /**
     * @param {Discord.GuildMember} member 
     * @returns {boolean}
     */
    isAdmin(member) {
        const isOwner = member.hasPermission('ADMINISTRATOR');
        
        if (isOwner || this.generalSettings.adminRoles == null) {
            return isOwner;
        }

        const adminRole = this.generalSettings.adminRoles.find((role) => role.guild === member.guild);

        return adminRole != null ? adminRole.comparePositionTo(member.roles.highest) <= 0 : isOwner;
    }

}

/**
 * @typedef GeneralSettings
 * @property {string} adventure
 * @property {string} prefix
 * @property {string} adminRole
 * @property {Array<Discord.Role>} adminRoles
 * @property {Array<string>} channels
 * @property {boolean} logs
 */