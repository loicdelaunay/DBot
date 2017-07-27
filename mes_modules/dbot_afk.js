//** DBOT AFK : Api pour la gestion des afk avec le DBOT**//

// Importation des APIs
const Discord = require('discord.js'); // api de discord
const path = require('path'); // api de gestion des chemins d'accès
const dateTime = require('node-datetime'); //api pour la gestion du temps
const fs = require('fs'); // api de lecture/ecriture de fichier

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module Permission
const dbot_divers = require('../mes_modules/dbot_divers.js'); // Importation de mon module Divers

exports.commande = function (msg, args, commande) {

    //*afk aide -> Permet d'afficher l'aide afk
    if (commande[0] == 'aideafk') {}

    //*afk -> Permet de se mettre AFK pendant X temps
    else if (commande[0] == 'afk') {
        dbot_console.printConsoleCommande(msg);

        try {

            //Set la date
            var dt = dateTime.create();
            console.log(dt);

            //Récupération de l'i de l'utilisateur
            var idUtilisateur = msg.author.id;

            //Fichier de destination 
            var destination = dbot_divers.dossierRoot() + '/data/afk/' + idUtilisateur + '.json ';

            //Vérifie si le fichier utilisateur existe 
            fs.stat(destination, function (err, data) {

                //Si le fichier n'existe pas 
                if (err) {
                    dbot_console.logconsole("Création d'un fichier afk pour l'utilisateur " + idUtilisateur + ' alias : ' + msg.author.username + '...', 'debug');

                    //Génère une variable avec les infos préremplis
                    var infoTemp = '{ "id": ' + idUtilisateur + ', "timestampFinAfk": ' + dt + '}';

                    //Créer le fichier
                    fs.writeFile(destination, 'biteuh !', 'utf8', function (err) {
                        if (err) {
                            dbot_console.logconsole("Erreur pendant l'écriture d'un nouveau fichier afk utilisateur : " + err, "error")
                        } else {
                            var verif = fs.readFile(destination, function (err, data) {
                                if (err) {
                                    dbot_console.logconsole("Erreur intégrité fichier afk de l'utilisateur : " + destination + err, "error")
                                }
                                dbot_console.logconsole("Création du fichier afk pour l'utilisateur " + idUtilisateur + ' alias : ' + msg.author.username + ' terminé', 'debug')
                                return verif;
                            });
                        }
                    });
                }

                //Si le fichier existe le supprime puis le réécrit
                else {
                    console.log("Suppression du fichier fdp")
                    fs.unlink(destination, function (error) {
                        if (err) {
                            dbot_console.logconsole("Problème pendant la suppression d'un fichier afk : " + destination, 'debug')
                        } else {
                            dbot_console.logconsole("Création d'un fichier afk après sa suppression pour l'utilisateur : " + idUtilisateur + 'alias : ' + msg.author.username, 'debug')

                            //Génère une variable avec les infos préremplis
                            var infoTemp = '{ "id": ' + idUtilisateur + ', "timestampFinAfk": ' + dt + '}';

                            //Créer le fichier
                            fs.writeFile(destination, infoTemp, function (err) {
                                if (err) {
                                    dbot_console.logconsole("Erreur pendant l'écriture d'un nouveau fichier afk utilisateur : " + err, "error")
                                } else {
                                    var verif = fs.readFile(destination, function (err, data) {
                                        if (err) {
                                            dbot_console.logconsole("Erreur intégrité fichier afk de l'utilisateur : " + destination + err, "error")
                                        }
                                        return verif;
                                    });
                                }
                            });
                        }
                    });
                }
            });
        } catch (err) {
            dbot_console.logconsole("Erreur pendant l'update de afk utilisateur" + err, "error");
        }
    }
}

/*function afkRefresh() {

    x = 5; // Temps en secondes de rafraichissement

    // Rafraichie tous les utilisateurs

    setTimeout(afkRefresh, x * 1000);

    dbot_console.logconsole("Rafraichissement des afk's ...", "debug");

    afkRefresh();
}*/
