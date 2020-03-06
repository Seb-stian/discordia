const Discord = require('discord.js');

module.exports = class Screen {

    /**
     * @param {Discord.Client} client
     * @param {Discord.User} owner
     * @param {ScreenSettings} settings
     * @param {Discord.Message} message
     */
    constructor(client, owner, settings, message = null) {
        this.owner = owner;
        this.client = client;
        this.embed = new Discord.MessageEmbed()
        .setColor(0xfffffe);

        this.design(settings.data);
        this.sendEmbed(settings.channel, settings.data, message);

        client.on('messageReactionAdd', (reaction, user) => this.onReaction(reaction, user));
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