const Discord = require('discord.js');
const Screen = require('../Screen');
const fama = require('fama');

module.exports = class CharacterCreationScreen extends Screen {

    phase = 0;
    working = false;
    data = {};

    design(data) {
        this.embed.setColor('GREEN').setAuthor('Choose your sex!');
    }

    /**
     * 
     * @param {import('discord.js').Message} message 
     * @param {*} data 
     */
    async sent(message, data) {
        this.setPhase(0);
    }

    /**
     * @param {import('discord.js').MessageReaction} reaction 
     */
    async handleReaction(reaction) {
        switch (this.phase) {
            case 0:
                switch (reaction.emoji.name) {
                    case '♂️':
                        this.data.sex = 'male';    
                        this.setPhase(1);
                        break;

                    case '♀️':
                        this.data.sex = 'female';
                        this.setPhase(1);
                        break;

                    default:
                        reaction.remove();
                }
                break;

            case 1:
                switch (reaction.emoji.name) {
                    case '🙎‍♂️', '🙎‍♀️':
                        this.data.race = 'human';
                        this.setPhase(2);
                        break;

                    case '🧝‍♂️', '🧝‍♀️':
                        this.data.race = 'elf';
                        this.setPhase(2);
                        break;

                    case '🧔':
                        this.data.race = 'dwarf';
                        this.setPhase(2);
                        break;

                    case '🧛‍♂️',  '🧛‍♀️':
                        this.data.race = 'vampire';
                        this.setPhase(2);
                        break;

                    case '🧟‍♂️', '🧟‍♀️':
                        this.data.race = 'undead';
                        this.setPhase(2);
                        break;

                    case '↩️':
                        this.setPhase(0);
                        break;
                    
                    default:
                        reaction.remove();
                }
                break;

            case 2:
                switch (reaction.emoji.name) {
                    case '🗡️':
                        this.data.type = 'warrior';
                        this.setPhase(3);
                        break;

                    case '✨':
                        this.data.type = 'mage';
                        this.setPhase(3);
                        break;

                    case '🏹':
                        this.data.type = 'archer';
                        this.setPhase(3);
                        break;

                    case '↩️':
                        this.setPhase(1);
                        break;

                    default:
                        reaction.remove();
                }
                break;
        }
    }

    async setPhase(index) {
        if (this.working) return;
        this.working = true;
        await this.message.reactions.removeAll();
        this.phase = index;

        switch (this.phase) {
            case 0:
                this.embed = new Discord.MessageEmbed().setColor('GREEN').setAuthor('Choose your sex!');
                await this.message.edit(this.embed);
                await this.react(['♂️', '♀️']);
                break;

            case 1:
                const emojiArray = this.data.sex === 'male' ?
                ['🙎‍♂️', '🧝‍♂️', '🧔', '🧛‍♂️', '🧟‍♂️', '↩️'] :
                ['🙎‍♀️', '🧝‍♀️', '🧔', '🧛‍♀️', '🧟‍♀️', '↩️'];
                this.embed = new Discord.MessageEmbed().setColor('GREEN').setAuthor('Choose your race!')
                .addField(emojiArray[0], 'Human', true)
                .addField(emojiArray[1], 'Elf', true)
                .addField(emojiArray[2], 'Dwarf', true)
                .addField(emojiArray[3], 'Vampire', true)
                .addField(emojiArray[4], 'Zombie', true);
                await this.message.edit(this.embed);
                await this.react(emojiArray);
                break;

            case 2:
                const emojisArray = ['🗡️', '✨', '🏹', '↩️'];
                this.embed = new Discord.MessageEmbed().setColor('GREEN').setAuthor('Choose your class!')
                .addField(emojisArray[0], 'Warrior', true)
                .addField(emojisArray[1], 'Mage', true)
                .addField(emojisArray[2], 'Archer', true);
                await this.message.edit(this.embed);
                await this.react(emojisArray);
                break;

            case 3: //temp
            this.embed = new Discord.MessageEmbed().setColor('ORANGE')
            .setAuthor(`You are a ${this.data.sex} ${this.data.race} and also a handsome ${this.data.type}!`);
            await this.message.edit(this.embed);
                break;
        }
        this.working = false;
    }

}