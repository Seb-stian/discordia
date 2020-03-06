const Discord = require('discord.js');
const Command = require('../Command');
const Controller = require('../Controller');

module.exports = class FindCommand extends Command {

    constructor() {
        super();
        this.adminOnly = false;
        this.command = 'find';
        this.cooldown = 10;
        this.cooldownType = 'user';
        this.description = 'finds your controller!';
    }

    /**
     * @param {Discord.Message} message 
     * @param {Controller} controller 
     */
    process(message, controller) {
        const userId = message.author.id;
        const result = controller.screens.find(screen => screen.owner.id === userId);
        const content = result != null ?
        `Your controller is [here](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${result.message.id})!` :
        `You have no controller right now! Create one with **${controller.generalSettings.prefix}join** command!`;

        const embed = new Discord.MessageEmbed()
        .setDescription(content)
        .setColor(0xfffffe);
        this.sendTimedMessage(embed, message.channel, 10000);
    }

    /**
     * @param {*} content 
     * @param {Discord.TextChannel} channel 
     * @param {number} time 
     */
    async sendTimedMessage(content, channel, time) {
        const message = await channel.send(content);
        message.delete({timeout: time});
    }

}