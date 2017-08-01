//** DBOT DISCORDLOG : Api pour la gestion des logs dans un salon discord**//

// Importation des APIs
const dateTime = require('node-datetime'); //api pour la gestion du temps

// Définie le channel de log
var channel = client.servers.get("bot_log", "D-BOT DEV");
client.sendMessage(channel, "test");
console.log("TEST");

// Log les messages des utilisateurs Discord
exports.addlogcommande = function (text) {
    var dt = dateTime.create();
    var formatted = dt.format('d-m-Y');
}
