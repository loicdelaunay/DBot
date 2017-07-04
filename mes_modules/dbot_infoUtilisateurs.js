//** DBOT infoUtilisateurs : Api pour la gestion des données des clients dans le DBOT**//


// Importation des APIs
const Discord = require('discord.js'); // api de discord
const fs = require('fs'); // api de lecture/ecriture de fichier
const dateTime = require('node-datetime'); //api pour la gestion du temps

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module permission
const dbot_divers = require('../mes_modules/dbot_divers.js'); // Importation de mon module divers

exports.commande = function (msg, args, commande) {
    //*mesinfos renseigne les information du joueur par rapport a la BDD du serveur
    if (commande[0] == 'mesinfos') {
        dbot_console.printConsoleCommande(msg);
        var infos = information(msg.author.id);
        msg.reply('\Ton ID : ' + infos[0] + '\Ton sel : ' + infos[1] + '\Ton niveau : ' + infos[2]);
    }

}

// Met à jour les informations de l'utilisateur
exports.updateUtilisateur = function (idUtilisateur, msg) {

    try {

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

                //Génère une variable avec les infos préremplis
                var infoTemp = '{ "nom": 0, "id": ' + idUtilisateur + ', "tempstotalvocal": 0, "derniermessage": 0, "datemessage": 0, "derniersalon": 0, "datederniersalon": 0, "xp": 0, "lvl": 0}';

                //Créer le fichier
                fs.writeFile(destination, infoTemp, function (err) {
                    if (err) {
                        dbot_console.logconsole("Erreur pendant l'écriture d'un nouveau fichier utilisateur : " + err, "error")
                    } else {
                        var fichierInfo = fs.readFile(destination, function (err, data) {
                            if (err) {
                                dbot_console.logconsole("Erreur pendant la lecture du nouveau fichier utilisateur : " + err, "error")
                            }
                            return fichierInfo;
                        });
                    }
                });
            }

            //Si le fichier existe l'update
            else {

                fs.readFile(destination, 'utf-8', function (err, data) {

                    if (err) {
                        throw err;
                    } else {
                        var infoUtilisateur = JSON.parse(data);

                        //Update le message si il n'est pas null
                        if (msg != null) {
                            infoUtilisateur.derniermessage = msg.content;
                            infoUtilisateur.datemessage = date;
                        }

                        //Update le nom de l'utilisateur si il à changé
                        if (infoUtilisateur.nom != msg.author.username) {
                            infoUtilisateur.nom = msg.author.username;
                        }

                        //Réécrit le fichier JSON
                        fs.writeFile(destination, JSON.stringify(infoUtilisateur), 'utf-8', function (err) {
                            if (err) {
                                dbot_console.logconsole("Erreur pendant l'écriture du nouveau fichier utilisateur : " + err, "error")
                            }
                        })
                    }
                })
            }
        })


    } catch (err) {
        dbot_console.logconsole("Erreur pendant l'update de l'utilisateur", "error")
    }
};

//Fonction tableau informations de l'utilisateur
function information(idauteur) {
    var fichierinfo = fs.readFileSync('./data/' + idauteur + '.txt', 'UTF-8');
    fichierinfo = fichierinfo.substring(1);
    fichierinfo = fichierinfo.substring(0, fichierinfo.length - 1);
    var infos = fichierinfo.split(",").slice();
    return infos;
}
