const Discord = require('discord.js');
const Screen = require('../Screen');
const fama = require('fama');

module.exports = class LocationScreen extends Screen {

    /**
     * @param {{
     * player: import('../Player'),
     * location: import('../adventure-types').Location}} data
     */
    design(data) {
        const player = data.player;
        const location = data.location;
        this.embed
        .setAuthor(location.name)
        .setDescription(location.description)
        .setColor(location.color);
    }

    /**
     * 
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