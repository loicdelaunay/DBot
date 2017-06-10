//** DBOT Prison : Api pour la gestion des punitions sur les personnes**//



// Importation des APIs
const Discord = require('discord.js'); // api de discord

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module Console


exports.commande = function (msg, args, commande) {
    //*block args[0] met en prison un client args[0] = client
    if (commande[0] == 'block') {
        dbot_console.printConsoleCommande(msg);
        msg.reply('Le rageux : ' + args[0] + ' a bien été bloque');
    }

    //*unblock args[0] sort de prison un client args[0] = client
    else if (commande[0] == 'unblock') {
        dbot_console.printConsoleCommande(msg);
        msg.reply('Le rageux : ' + args[0] + ' a bien ete debloque');
    }
}
