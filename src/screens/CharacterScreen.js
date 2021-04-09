const Discord = require('discord.js');
const Screen = require('../Screen');
const Player = require('../Player');
const fama = require('fama');

module.exports = class CharacterScreen extends Screen {

    /**
     * @param {{player: Player}} data
     */
    design(data) {
        const player = data.player.data;
        this.embed
        .setThumbnail(player.image)
        .setAuthor(Player.identityToEmoji(player.sex, player.race) + Player.identityToEmoji(player.type) + ' ' + player.name)
        .setDescription(`**health** ${player.health}/${player.maxHealth}\n` +
        `**mana** ${player.mana}/${player.maxMana}`);
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