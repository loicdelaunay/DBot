//** DBOT CONSOLE : Api pour la gestion de la console du BOT**//

// Importation des APIs
const fs = require('fs'); //api nodejs pour gestion des fichiers
const dateTime = require('node-datetime'); //api pour la gestion du temps

// Log les erreurs du D-BOT
exports.addlogerreur = function (text) {
    var dt = dateTime.create();
    var formatted = dt.format('d-m-Y');
    fs.appendFileSync('./logs/erreurs/logerreurs' + formatted + '.txt', text);
}

// Log les messages des utilisateurs Discord
exports.addlogmessage = function (text) {
    var dt = dateTime.create();
    var formatted = dt.format('d-m-Y');
    fs.appendFileSync('./logs/messages/logmessages' + formatted + '.txt', text);
}

// Log les commandes du DBOT éxécutés par les utilisateurs Discord
exports.addlogcommande = function (text) {
    var dt = dateTime.create();
    var formatted = dt.format('d-m-Y');
    fs.appendFileSync('./logs/commandes/logcommandes' + formatted + '.txt', text);
}

// Affiche les commandes éxécutés par l'utilisateur dans la console du DBOT
exports.printConsoleCommande = function (msg) {
    logconsole('Commande ' + msg.content + ' éxécutée', 'info', msg);
}

// Gestion des messages de log avec couleur et formatage
exports.logconsole = function (msg, type, objetmessage) {
    var dt = dateTime.create();
    var formatted = dt.format('d/m-H:M');
    log = '['.cyan + formatted.cyan + '] :'.cyan + ' ' + msg;
    if (objetmessage != null) {
        log += ' par : ' + objetmessage.author.username + ' ' + objetmessage.author.id;
    }
    switch (type) {
        case 'input':
            log += ' (input)'.input;
            break;
        case 'info':
            log += ' (info)'.info;
            break;
        case 'help':
            log += ' (help)'.help;
            break;
        case 'warn':
            log += ' (warn)'.warn;
            break;
        case 'debug':
            log += ' (debug)'.debug;
            break;
        case 'error':
            log += ' (error)'.error;
            var dt = dateTime.create();
            var formatted = dt.format('d-m-Y');
            fs.appendFileSync('./logs/erreurs/logerreurs' + formatted + '.txt', msg);
            break;
    }
    console.log(log);
}

// $logconsole Gestion des messages de log avec couleur et formatage dans ce module
function logconsole(msg, type, objetmessage) {
    var dt = dateTime.create();
    var formatted = dt.format('d/m-H:M');
    log = '['.cyan + formatted.cyan + '] :'.cyan + ' ' + msg;
    if (objetmessage != null) {
        log += ' par : ' + objetmessage.author.username + ' ' + objetmessage.author.id;
    }
    switch (type) {
        case 'input':
            log += ' (input)'.input;
            break;
        case 'info':
            log += ' (info)'.info;
            break;
        case 'help':
            log += ' (help)'.help;
            break;
        case 'warn':
            log += ' (warn)'.warn;
            break;
        case 'debug':
            log += ' (debug)'.debug;
            break;
        case 'error':
            log += ' (error)'.error;
            break;
    }
    console.log(log);
}
