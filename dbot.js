//***** D BOT *****//
//AUTHEUR : Dream//

// CTRL + F *nomdelacommande pour rechercher les commandes dans le projet 
// CTRL + F $nomdelafonction pour rechercher les fonctions dans le projet 

// Version du D-BOT
const version = "0.9.7";

// Affichage GUI PRIORITAIRE ! 
var dbot_gui = require('./mes_modules/dbot_gui.js');

// Importation des modules
const Discord = require('discord.js'); // api de Discord 
const client = new Discord.Client(); // api client de Discord
const dateTime = require('node-datetime'); //api pour la gestion du temps
const child_process = require('child_process'); //api pour gérer les processus
const colors = require('colors'); // api pour gérer la couleur dans la console 
const path = require('path'); // api de gestion des chemins d'accès
const fs = require('fs'); // api de gestion des fichiers

// Chargement du fichier de configuration du D-BOT ou si il n'existe pas lance l'installation du DBOT
if (!fs.existsSync('./dbot_config.json')) {
    console.log("Fichier de configuration introuvable, Merci d'éxécuter dbot_config ou configbot.bat.");
}
// Si le fichier de config existe ( donc le DBOT est installé ) éxécute le programme
else {
    console.log("Fichier de configuration trouvé ! Chargement des options.");
    var config = require('./dbot_config.json');
    console.log("Fichier de configuration chargé...");

    // Importation de mes modules obligatoire
    var dbot_divers = require('./mes_modules/dbot_divers.js'); // Importation de mon module Divers
    console.log("Chargment de l'api divers ok...");

    var dbot_console = require('./mes_modules/dbot_console.js'); // Importation de mon module Console
    console.log("Chargment de l'api console ok...");

    var dbot_permission = require('./mes_modules/dbot_permission.js'); // Importation de mon module Console
    console.log("Chargment de l'api permission ok...");


    //Initialisation des modules configurable
    var dbot_youtube = null;
    var dbot_prison = null;
    var dbot_musique = null;
    var dbot_messageAutoReponse = null;
    var dbot_web = null;
    var dbot_afk = null;

    //Importation de mes modules en fonction du fichier de configuration
    if (config.module_youtube) {
        dbot_youtube = require('./mes_modules/dbot_youtube.js'); // Importation de mon module Youtube
        console.log("Chargment de l'api youtube ok...");
    }
    if (config.module_prison) {
        dbot_prison = require('./mes_modules/dbot_prison.js'); // Importation de mon module Prison
        console.log("Chargment de l'api prison ok...");
    }
    if (config.module_musique) {
        dbot_musique = require('./mes_modules/dbot_musique.js'); // Importation de mon module Musique
        console.log("Chargment de l'api musique ok...");
    }
    if (config.module_messageAutoReponse) {
        dbot_messageAutoReponse = require('./mes_modules/dbot_messageAutoReponse.js'); // Importation de mon module messageAutoReponse 
        console.log("Chargment de l'api autoreponse ok...");
    }
    if (config.module_serveurWeb) {
        dbot_web = require('./mes_modules/dbot_web.js'); // Importation de mon module Web
        console.log("Chargment de l'api serveurweb ok...");
    }
    if (config.module_afk) {
        dbot_afk = require('./mes_modules/dbot_afk.js'); // Importation de mon module Web
        console.log("afk ok...");
    }
    console.log("\nFIN DU CHARGEMENT DES API'S");

    // Dossier de lancement du bot
    var appDir = path.dirname(require.main.filename);

    // Initialisation des couleurs du thème de la console
    colors.setTheme({
        silly: 'rainbow',
        input: 'grey',
        verbose: 'cyan',
        prompt: 'grey',
        info: 'green',
        data: 'grey',
        help: 'cyan',
        warn: 'yellow',
        debug: 'blue',
        error: 'red'
    });

    // Initialisation du bot
    const entete = '\n********************** LANCEMENT DU D-BOT ' + version + ' ... ***********************\n\n'
    console.log(entete.bgWhite.black);


    console.log('Version du D-BOT : ' + version);
    console.log('Version de NODEJS : ' + process.version)
    console.log('Version de DISCORDJS : ' + Discord.version)

    console.log('Chemin du D-BOT utilisé : ' + appDir);
    console.log('Chemin de ffmpegPath utilisé : ' + dbot_divers.dossierFfmpeg());

    // Token du bot 
    const token = config.token;
    console.log('Token Discord du bot utilisé : ' + config.token);

    // Préfix des commandes du bot
    const prefix = config.prefix;
    console.log('Prefix des commandes utilisé : ' + config.prefix);

    // Id Admin
    console.log('Id admin chargé : ' + dbot_permission.idadmin());

    const entete2 = '\n********************** FICHIER DE CONFIGURATION ***********************\n\n'
    console.log(entete2.bgWhite.black);


    // Connection à Discord
    client.login(token);

    // A la conncetion du bot
    client.on('ready', () => {
        var dt = dateTime.create();
        var heurestart = dt.format('d-m-Y H:M:S'); //Set la date du bot sur son heure de démarrage 
        client.user.setStatus("online");
        client.user.setGame("/aide pour obtenir de l'aide");
        dbot_console.logconsole('Le D-BOT est fonctionnel ! ' + heurestart, 'debug');
    });

    // Quand le bot reçoit un message le traitement s'effectue ici 
    client.on('message', msg => {

        //Si le message vient du bot alors on l'ignore 
        if (msg.author.bot) return;

        var dt = dateTime.create();
        var formatted = dt.format('d-m-Y H:M:S');
        dbot_console.addlogmessage("L'utilisateur : " + msg.author.username + ' Avec ID : ' + msg.author.id + ' a posté le message suivant : ' + msg.content + ' posté le : ' + formatted + '\n');

        //Importe le message dans le module AutoReponse pour voir si le bot doit répondre
        if (config.module_messageAutoReponse) {
            dbot_messageAutoReponse.message(msg);
        }


        //découpe le message en argument pour chaque espaces 
        var args = msg.content.split(" ").slice(1);

        //découpage du message pour récupérer la commande
        if (msg.content.startsWith(prefix)) {
            //récupération de la commande
            var commande = msg.content;
            var commande = commande.substring(1);
            var commande = commande.split(" ").slice(0);

            //login a une date
            var dt = dateTime.create();
            var formatted = dt.format('d-m-Y H:M:S');
            dbot_console.addlogcommande("L'utilisateur : " + msg.author.username + ' Avec ID : ' + msg.author.id + ' a utilisé la commande suivante : ' + msg.content + ' posté le : ' + formatted + '\n');
        } else {
            var commande = '';
        }

        //Les aides 
        if (msg.content.startsWith(prefix)) {


            //Affiche la commande dans le GUI
            dbot_gui.consoleADD(msg);

            // *-*-*-*- PASSAGE DE LA COMMANDE DANS LES MODULES *-*-*-*-*- //

            //Passage de la commande dans le module DBOT DIVERS
            dbot_divers.commande(msg, args, commande);

            //Passage de la commande dans le module DBOT AFK
            if (config.module_afk) {
                dbot_afk.commande(msg, args, commande);
            }

            //Passage de la commande dans le module DBOT MUSIQUE
            if (config.musique) {
                dbot_musique.commande(msg, args, commande);
            }

            //Passage de la commande dans le module DBOT PRISON
            if (config.module_prison) {
                dbot_prison.commande(msg, args, commande);
            }

            // *-*-*-*- FIN DU PASSAGE DE LA COMMANDE DANS LES MODULES *-*-*-*-*- //

            //*aide -> affiche l'aide global ( une pour chaue module )
            if (commande[0] == 'aide' || commande[0] == '?') {
                dbot_console.printConsoleCommande(msg);

                const embed = new Discord.RichEmbed()
                    .setTitle("   ❓   AIDE :   ❓   ")
                    .setColor(0x244dbe)
                    .setDescription("Voici l'aide général du DBOT")
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()

                    .addField('\u200B', '\u200B')

                    .addField('*', "pour parler avec l 'ia du bot taper * avant votre message")
                    .addField('/aidedivers ou /aided', "pour obtenir l'aide concernant les fonctions diverses du DBOT")
                    .addField('/aidewot ou /aidew', "pour obtenir l'aide à propos des commandes du jeu World Of Tanks")

                    .addField('\u200B', '\u200B')
                msg.channel.send({
                    embed
                });

            }

        }
    });

    // Message de bienvenue 
    client.on('guildMemberAdd', member => {

        const embed = new Discord.RichEmbed()
            .setTitle("  📢  BIENVENUE:  📢   ")
            .setColor(0x00ff00)
            .setAuthor(member.user.username, member.user.avatarURL)
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

        member.guild.defaultChannel.send({
            embed
        });
    });
}
