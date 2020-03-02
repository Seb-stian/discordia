const Discord = require('discord.js');
const Command = require('../Command');
const Controller = require('../Controller');

module.exports = class JoinCommand extends Command {

    constructor() {
        super();
        this.adminOnly = true;
        this.command = 'join';
        this.cooldown = 0;
        this.description = 'joins you to the game';
    }
    
    /**
     * @param {Discord.Message} message 
     * @param {Controller} controller 
     */
    onCall(message, controller) {
        
    }

}