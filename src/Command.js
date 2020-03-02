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
    }

    /**
     * @param {Discord.Message} message 
     * @param {Controller} controller 
     */
    onCall(message, controller) {
        if (!this._ready) return;
        this.onAfterCall();
    }

    onAfterCall() {
        if (this.cooldown > 0) {
            this._ready = false;
            setTimeout(() => this._ready = true, this.cooldown * 1000);
        }
    }

}