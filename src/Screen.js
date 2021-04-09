const Discord = require('discord.js');

module.exports = class Screen {

    /**
     * @param {import('./Controller')} controller
     * @param {Discord.Client} client
     * @param {Discord.User} owner
     * @param {ScreenSettings} settings
     * @param {Discord.Message} message
     */
    constructor(controller, client, owner, settings, message = null) {
        this.controller = controller;
        this.owner = owner;
        this.client = client;
        this.settings = settings;
        this.embed = new Discord.MessageEmbed()
        .setColor(0xfffffe);

        this.design(settings.data);
        this.sendEmbed(settings.channel, settings.data, message);

        this.listener = (reaction, user) => this.onReaction(reaction, user);
        client.on('messageReactionAdd', this.listener);
    }

    /**
     * 
     * @param {Discord.TextChannel} channel 
     * @param {*} data 
     * @param {Discord.Message} oldMessage 
     */
    async sendEmbed(channel, data, oldMessage) {
        /**
         * @type {Discord.Message}
         */
        this.message = oldMessage != null ? await oldMessage.edit(this.embed) : await channel.send(this.embed);
        this.sent(this.message, data);
    }

    /**
     * @param {Discord.MessageReaction} reaction 
     * @param {Discord.User|Discord.PartialUser} user 
     */
    onReaction(reaction, user) {
        if (user.id === this.client.user.id) {
            return;
        }
        else if (user.id !== this.owner.id) {
            reaction.users.remove(user);
        }
        else {
            this.handleReaction(reaction);
        }
    }

    /**
     * @param {Array<string>} emojis 
     */
    async react(emojis) {
        for (const emoji of emojis) {
            await this.message.react(emoji);
        }
    }

    /**
     * @param {Screen} screen 
     */
    changeTo(screen) {
        this.client.removeListener('messageReactionAdd', this.listener);
        this.controller.removeScreen(this);
        this.controller.addScreen(screen);
    }

    /* implemented in inherited classes */

    design(data) {

    }

    /**
     * @param {Discord.Message} message
     * @param {*} data 
     */
    async sent(message, data) {
        
    }

    /**
     * @param {Discord.MessageReaction} reaction 
     */
    async handleReaction(reaction) {
        
    }

}

/**
 * @typedef ScreenSettings
 * @property {Discord.TextChannel} channel
 * @property {*} data
 */