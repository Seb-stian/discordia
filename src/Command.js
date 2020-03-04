'use strict';

const Discord = require('discord.js');
const Controller = require('./Controller');

module.exports = class Command {

    constructor() {
        this.adminOnly = false;
        this.command = '';
        this.description = '';
        this.cooldown = 0;
        this._ready = true;

        /**
         * @type {'user'|'all'|'none'}
         */
        this.cooldownType = 'user';
        this.cache = [];
    }

    /**
     * @param {Discord.Message} message
     * @param {Controller} controller
     * @param {boolean} isAdmin
     */
    onCall(message, controller, isAdmin) {
        if (!isAdmin && !this.isReady(message.member)) {
            return;
        }
        this.process(message, controller, isAdmin);
    }

    /**
     * @param {Discord.Message} message 
     * @param {Controller} controller 
     */
    process(message, controller) {
        // implemented in child classes
    }

    /**
     * @param {Discord.GuildMember} caller
     * @returns {boolean}
     */
    isReady(caller) {
        if (this.cooldown <= 0) {
            return true;
        }
        switch (this.cooldownType) {
            case 'user':
                const currentTimestamp = Date.now();
                for (let i = 0; i < this.cache.length; i++) {
                    const entry = this.cache[i];
                    if (entry.id === caller.id) {
                        if (currentTimestamp - entry.timestamp >= this.cooldown) {
                            entry.timestamp = currentTimestamp;
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                }
                this.cache.push({ id: caller.id, timestamp: currentTimestamp });
                return true;

            case 'all':
                if (!this._ready) {
                    return false;
                }
                this._ready = false;
                setTimeout(() => this._ready = true, this.cooldown * 1000);
                return true;

            default:
                return true;
        }
    }

}