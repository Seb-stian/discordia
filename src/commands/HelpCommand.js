const Discord = require('discord.js');
const Command = require('../Command');
const Controller = require('../Controller');

module.exports = class HelpCommand extends Command {

    constructor() {
        super();
        this.adminOnly = false;
        this.command = 'help';
        this.cooldown = 10;
        this.description = 'shows you bunch of helpful commands';
        this.text = '';
        this.adminText = '';
        this.cooldownType = 'all';
    }

    /**
     * @param {Discord.Message} message 
     * @param {Controller} controller 
     */
    process(message, controller, isAdmin) {
        const response = new Discord.MessageEmbed();
        response.setColor(0xfffffe).setDescription(isAdmin ? this.adminText : this.text);
        message.reply(response);
    }

    /**
     * @param {Array<Command>} commands 
     */
    onCommandsLoaded(commands) {
        const commandTexts = [];
        const adminCommandTexts = [];
        for (let i = 0; i < commands.length; i++) {
            const commandText = `**${commands[i].command}** ${commands[i].description}`
            let cooldownText = commands[i].cooldown > 0 ? ` (cooldown ${commands[i].cooldown}s)` : '';

            // for admins
            adminCommandTexts.push(commandText);

            // for users
            if (!commands[i].adminOnly) {
                commandTexts.push(commandText + cooldownText);
            }
        }
        this.text = commandTexts.join('\n');
        this.adminText = adminCommandTexts.join('\n');
    }

}