const Discord = require('discord.js');
const Command = require('../Command');
const Controller = require('../Controller');

module.exports = class JoinCommand extends Command {

    constructor() {
        super();
        this.adminOnly = false;
        this.command = 'join';
        this.cooldown = 0;
        this.description = 'joins you to the game';
    }

    /**
     * @param {Discord.Message} message 
     * @param {Controller} controller 
     */
    process(message, controller) {
        const x=new(require('../screens/CharacterCreationScreen'))(controller,controller.client,message.author,{channel: message.channel});
        controller.addScreen(x);
    }

}