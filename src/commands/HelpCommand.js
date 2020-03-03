const Discord = require('discord.js');
const Command = require('../Command');
const Controller = require('../Controller');

module.exports = class JoinCommand extends Command {

    constructor() {
        super();
        this.adminOnly = false;
        this.command = 'help';
        this.cooldown = 10;
        this.description = 'shows you bunch of helpful commands';
        this.text = '';
    }

    /**
     * @param {Discord.Message} message 
     * @param {Controller} controller 
     */
    onCall(message, controller) {
        const response = new Discord.MessageEmbed();
        response.setColor(0xfffffe).setDescription(this.text);
        message.reply(response);
        this.onAfterCall();
    }

    /**
     * @param {Array<Command>} commands 
     */
    onCommandsLoaded(commands) {
        const commandTexts = [];
        for (let i = 0; i < commands.length; i++) {
            let adminText = commands[i].adminOnly ? ' [ADMIN]' : '';
            let cooldownText = commands[i].cooldown > 0 ? ` (cooldown ${commands[i].cooldown}s)` : '';
            commandTexts.push(`**${commands[i].command}** ${commands[i].description}${cooldownText}${adminText}`);
        }
        this.text = commandTexts.join('\n');
    }

}