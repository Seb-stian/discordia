const Discord = require('discord.js');

module.exports = class Player {

    /**
     * @param {import('./adventure-types').PlayerData} data 
     */
    constructor(data) {
       this.data = data; 
    }

    /**
     * @param {Discord.User} user 
     * @param {*} data 
     * @returns {Player}
     */
    static createNew(user, data) {
        return new Player({
            userID: user.id,
            image: user.displayAvatarURL({size: 256}),
            name: user.username,
            sex: data.sex,
            race: data.race,
            type: data.type,
            level: 1,
            xp: 0,
            health: 100,
            mana: 100,
            maxHealth: 100,
            maxMana: 100,
            strength: 10,
            endurance: 10,
            wisdom: 10,
            agility: 10,
            equipedWeapon: null,
            equipedArmor: [],
            equipedUsables: [],
            inventory: [],
            currentLocation: data.location
        });
    }

    static identityToEmoji(identity, identity2 = null) {
        switch (identity) {
            case 'male':
                switch (identity2) {
                    case 'human':
                        return '🙎‍♂️';
                    case 'elf':
                        return '🧝‍♂️';
                    case 'dwarf':
                        return '🧔';
                    case 'vampire':
                        return  '🧛‍♂️';
                    case 'undead':
                        return '🧟‍♂️';
                }
                break;

            case 'female':
                switch (identity2) {
                    case 'human':
                        return '🙎‍♀️';
                    case 'elf':
                        return '🧝‍♀️';
                    case 'dwarf':
                        return '🧔';
                    case 'vampire':
                        return '🧛‍♀️';
                    case 'undead':
                        return '🧟‍♀️';
                }
                break;

            case 'warrior':
                return '🗡️';

            case 'mage':
                return '✨';

            case 'archer':
                return '🏹';
        }
        return '❓';
    }
}