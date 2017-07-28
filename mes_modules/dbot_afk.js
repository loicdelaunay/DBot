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
    if (commande[0] == 'aideafk') {

        const embed = new Discord.RichEmbed()
            .setTitle("   ❓   AIDE AFK:   ❓   ")
            .setColor(0xa200ea)
            .setDescription("Voici l'aide afk du bot")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

            .addField('/afk X', "pour vous mettre AFK pendant X minutes.")
            .addField('/afk S X', "pour vous mettre AFK pendant X secondes.")
            .addField('/afk M X', "pour vous mettre AFK pendant X minutes.")
            .addField('/afk H X', "pour vous mettre AFK pendant X heures.")

        msg.channel.send({
            embed
        });

    }

    //*afk -> Permet de se mettre AFK pendant X temps
    else if (commande[0] == 'afk') {
        dbot_console.printConsoleCommande(msg);

        try {

            //Set la date
            var date = new Date();

            //si l'arg est null 
            if (args[0] == null) {

                const embed = new Discord.RichEmbed()
                    .setTitle("   ❓   ERREUR AFK:   ❓   ")
                    .setColor(0xa200ea)
                    .setDescription("Une erreur est survenue pendant l'execution de la commande / AFK")
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()

                    .addField('\u200B', '\u200B')

                    .addField('/aideafk', "pour obtenir de l'aide sur la commande AFK.")

                msg.channel.send({
                    embed
                });

            } else {

                //Récupération de l'i de l'utilisateur
                var idUtilisateur = msg.author.id;

                //Fichier de destination 
                var destination = dbot_divers.dossierRoot() + '/data/afk/' + idUtilisateur + '.json';

                switch (args[0].toUpperCase()) {
                    case "S":
                        date.setSeconds(date.getSeconds() + parseInt(args[1]));
                        console.log("S")
                        break;
                    case "M":
                        date.setMinutes(date.getMinutes() + parseInt(args[1]));
                        console.log("M")
                        break;
                    case "H":
                        date.setHours(date.getHours() + parseInt(args[1]));
                        console.log("H")
                        break;
                    default:
                        date.setMinutes(date.getMinutes() + parseInt(args[0]));
                        console.log("DEFAULT")
                }

                //Fichier afk Json de l'utilisateur
                var infoTemp = '{ "id": ' + idUtilisateur + ', "timestampFinAfk": ' + "\"" + date + "\"" + '}';

                //Vérifie si le fichier utilisateur existe 
                fs.stat(destination, function (err, data) {

                    //Si le fichier n'existe pas 
                    if (err) {
                        dbot_console.logconsole("Création d'un fichier afk pour l'utilisateur " + idUtilisateur + ' alias : ' + msg.author.username + '...', 'debug');

                        //Créer le fichier
                        fs.writeFile(destination, infoTemp, 'utf8', function (err) {
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
                        fs.unlink(destination, function (error) {
                            if (err) {
                                dbot_console.logconsole("Problème pendant la suppression d'un fichier afk : " + destination, 'debug')
                            } else {
                                dbot_console.logconsole("Création d'un fichier afk après sa suppression pour l'utilisateur : " + idUtilisateur + 'alias : ' + msg.author.username, 'debug')

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
            }
        } catch (err) {
            dbot_console.logconsole("Erreur pendant l'update de afk utilisateur" + err, "error");
        }
    }
}


function afkRefresh() {

    var destinationRefresh = dbot_divers.dossierRoot() + '/data/afk/';

    fs.readdir(destinationRefresh, (err, files) => {
        files.forEach(file => {

            console.log(file);

            var destinationRefreshFile = dbot_divers.dossierRoot() + '/data/afk/' + file;

            fs.readFile(destinationRefreshFile, 'utf-8', function (err, data) {

                if (err) {
                    dbot_console.logconsole("Erreur pendant la lecture afk d'un utilisateur : " + destinationRefreshFile + err, "error");
                } else {
                    var infoUtilisateurAfk = JSON.parse(data);

                    var date = new Date();
                    var dateAfk = new Date(infoUtilisateurAfk.timestampFinAfk);

                    //si la date AFK est dépassé
                    if (date > dateAfk) {
                        var finAfkPour = destinationRefreshFile.id;
                        fs.unlink(destinationRefreshFile, function (error) {
                            if (err) {
                                dbot_console.logconsole("Problème pendant la suppression d'un fichier afk : " + destination, 'debug')
                            } else {
                                dbot_console.logconsole("Fin d'afk pour : " + finAfkPour, 'debug')
                            }
                        });
                    }
                }
            })
        });
    })
    dbot_console.logconsole("Rafraichissement des afk's ...", "debug");
}


x = 5; // Temps en secondes de rafraichissement

//Appelle une première fois la fonction
setInterval(afkRefresh, x * 1000);
