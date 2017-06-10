//** DBOT messageAutoReponse : Api pour répondre automatiquement à certains messages**//



// Importation des APIs
const Discord = require('discord.js'); // api de discord

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module Permission
const dbot_divers = require('../mes_modules/dbot_divers.js'); // Importation de mon module Divers

//TODO créer une fonction de génération automatique
exports.message = function (msg) {
    if (dbot_divers.derniermot(msg.content) === 'ping') {
        msg.reply('Pong!');
        console.log('Blague : pong effectué !');
    } else if (dbot_divers.derniermot(msg.content) === 'AH!') {
        msg.reply('https://i.ytimg.com/vi/HdZ5OD1KMGs/hqdefault.jpg');
        console.log('Blague : AH! effectué !');
    } else if (dbot_divers.derniermot(msg.content) === 'quoi' ||
        dbot_divers.derniermot(msg.content) === 'quoi?') {
        msg.reply('feur');
    } else if (dbot_divers.derniermot(msg.content) === 'comment') {
        msg.reply('dant coustaud');
    } else if (dbot_divers.derniermot(msg.content) === 'hein') {
        msg.reply('deux');
    }

    //*ia "message" utilise l'api cleverbot pour repondre à un message
    if (msg.content.startsWith('*')) {
        var cleverbot = require('cleverbot-node');
        cleverbot = new cleverbot();
        cleverbot.configure({
            botapi: "CC26pVh6I-nrtGiKVW6KQ55XV_g"
        });
        cleverbot.write(msg.content.substring(0), function (response) {
            msg.reply(response.output);
        });
    }
}
