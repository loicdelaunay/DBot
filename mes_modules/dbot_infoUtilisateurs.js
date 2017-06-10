//** DBOT infoUtilisateurs : Api pour la gestion des données des clients dans le DBOT**//



// Importation des APIs
const Discord = require('discord.js'); // api de discord

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module Console

exports.commande = function (msg, args, commande) {
    //*register enregistre l'utilisateur dans la BDD local
    if (commande[0] == 'register') {
        dbot_console.printConsoleCommande(msg);
        msg.reply('Tu a bien été enregistré comme membre sur le D-BOT : ' + msg.author.username);
        var info = msg.author.id + ', 0, 0';
        var file = fs.writeFile('./data/' + msg.author.id + '.txt', JSON.stringify(info), function (err) {
            if (err) {
                console.log('Erreur :( ' + err);
            }
        });
    }

    //*mesinfos renseigne les information du joueur par rapport a la BDD du serveur
    else if (commande[0] == 'mesinfos') {
        dbot_console.printConsoleCommande(msg);
        var infos = information(msg.author.id);
        msg.reply('\Ton ID : ' + infos[0] + '\Ton sel : ' + infos[1] + '\Ton niveau : ' + infos[2]);
    }

}

//Fonction tableau informations de l'utilisateur
function information(idauteur) {
    var fichierinfo = fs.readFileSync('./data/' + idauteur + '.txt', 'utf8');
    fichierinfo = fichierinfo.substring(1);
    fichierinfo = fichierinfo.substring(0, fichierinfo.length - 1);
    var infos = fichierinfo.split(",").slice();
    return infos;
}
