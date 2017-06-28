//** DBOT infoUtilisateurs : Api pour la gestion des données des clients dans le DBOT**//


// Importation des APIs
const Discord = require('discord.js'); // api de discord
const fs = require('fs'); // api de lecture/ecriture de fichier
const dateTime = require('node-datetime'); //api pour la gestion du temps
var jsonfile = require('jsonfile') //api pour la gestion json

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module permission
const dbot_divers = require('../mes_modules/dbot_divers.js'); // Importation de mon module divers

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


//Fonction qui vérifie si le fichier info de l'utilisateur existe sinon le créer
exports.updateUtilisateur = function (idUtilisateur, msg) {

    //Set la date d'update
    var dt = dateTime.create();
    var date = dt.format('d-m-Y H:M:S');

    //Fichier de destination
    var destination = dbot_divers.dossierRoot() + '/data/infoUtilisateurs/' + idUtilisateur + '.json'

    //Vérifie si le fichier utilisateur existe
    fs.stat(destination, function (err, data) {

        //Si le fichier n'existe pas
        if (err) {
            dbot_console.logconsole("Création d'un fichier pour l'utilisateur : " + idUtilisateur, 'debug')

            //créer le fichier et le return

            var infoTemp = '{ "nom": 0, "id": ' + idUtilisateur + ', "tempstotalvocal": 0, "derniermessage": 0, "datemessage": 0, "derniersalon": 0, "datederniersalon": 0, "xp": 0, "lvl": 0}';

            fs.writeFile(destination, infoTemp, function (err) {
                if (err) {
                    dbot_console.addlogerreur("Erreur pendant l'écriture d'un nouveau fichier utilisateur : " + err)
                }
                var fichierInfo = fs.readFile(destination, function (err, data) {
                    if (err) {
                        dbot_console.addlogerreur("Erreur pendant la lecture du nouveau fichier utilisateur : " + err)
                    }
                    return fichierInfo;
                });
            });
        }

        //Sinon l'update'
        else {
            console.log("Fichier trouvé lecture ...")

            var infoUtilisateurJson = destination
            jsonfile.readFile(infoUtilisateurJson, function (err, obj) {
                if (err) {
                    dbot_console.addlogerreur("Erreur pendant la lecture du fichier utilisateur : " + destination + err)
                } else {
                    if (msg != null) {
                        obj.derniermessage = msg;
                        obj.datemessage = date;
                    }
                    jsonfile.writeFile(destination, obj, function (err) {
                        if (err) {
                            dbot_console.addlogerreur("Erreur pendant l'écriture' du fichier utilisateur : " + destination + err)
                        }
                    })
                }
            })

        }
    })
}

//Fonction tableau informations de l'utilisateur
function information(idauteur) {
    var fichierinfo = fs.readFileSync('./data/' + idauteur + '.txt', 'UTF-8');
    fichierinfo = fichierinfo.substring(1);
    fichierinfo = fichierinfo.substring(0, fichierinfo.length - 1);
    var infos = fichierinfo.split(",").slice();
    return infos;
}
