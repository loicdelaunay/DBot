//***** D BOT *****//
//AUTHEUR : Dream//

// CTRL + F *nomdelacommande pour rechercher les commandes dans le projet 
// CTRL + F $nomdelafonction pour rechercher les fonctions dans le projet 

// Chargement du fichier de configuration du D-BOT
const config = require('./dbot_config.json');

// Importation des modules
const Discord = require('discord.js'); // api de Discord 
const client = new Discord.Client(); // api client de Discord
const dateTime = require('node-datetime'); //api pour la gestion du temps
const child_process = require('child_process'); //api pour gérer les processus
const colors = require('colors'); // api pour gérer la couleur dans la console 
const path = require('path'); // api de gestion des chemins d'accès

// Importation de mes modules
const dbot_divers = require('./mes_modules/dbot_divers.js'); // Importation de mon module Divers
const dbot_wot = require('./mes_modules/dbot_wot.js'); // Importation de mon module World of tanks
const dbot_wotTournoi = require('./mes_modules/dbot_wotTournoi.js'); // Importation de mon module World of tanks
const dbot_youtube = require('./mes_modules/dbot_youtube.js'); // Importation de mon module Youtube
const dbot_console = require('./mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('./mes_modules/dbot_permission.js'); // Importation de mon module Console
const dbot_infoUtilisateurs = require('./mes_modules/dbot_infoUtilisateurs.js'); // Importation de mon module des infosUtilisateurs
const dbot_prison = require('./mes_modules/dbot_prison.js'); // Importation de mon module Prison
const dbot_musique = require('./mes_modules/dbot_musique.js'); // Importation de mon module Musique
const dbot_messageAutoReponse = require('./mes_modules/dbot_messageAutoReponse.js'); // Importation de mon module messageAutoReponse
const dbot_web = require('./mes_modules/dbot_web.js'); // Importation de mon module Web

// Version du D-BOT
const version = dbot_divers.version();

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

try {

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

        var dt = dateTime.create();
        var formatted = dt.format('d-m-Y H:M:S');
        dbot_console.addlogmessage("L'utilisateur : " + msg.author.username + ' Avec ID : ' + msg.author.id + ' a posté le message suivant : ' + msg.content + ' posté le : ' + formatted + '\n');

        //Importe le message dans le module AutoReponse pour voir si le bot doit répondre
        dbot_messageAutoReponse.message(msg);

        //Met à jour les informations de l'utilisateur concerné
        dbot_infoUtilisateurs.updateUtilisateur(msg.author.id, msg);
    });


    // Quand le bot recoit une commande
    client.on('message', msg => {

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

            // *-*-*-*- PASSAGE DE LA COMMANDE DANS LES MODULES *-*-*-*-*- //

            //Passage de la commande dans le module DBOT DIVERS
            dbot_divers.commande(msg, args, commande);

            //Passage de la commande dans le module DBOT WOT
            dbot_wot.commande(msg, args, commande);

            //Passage de la commande dans le module DBOT WOTTOURNOI
            dbot_wotTournoi.commande(msg, args, commande);

            //Passage de la commande dans le module DBOT MUSIQUE
            dbot_musique.commande(msg, args, commande);

            //Passage de la commande dans le module DBOT PRISON
            dbot_prison.commande(msg, args, commande);

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
            .setTitle("   ☺   BIENVENUE:   ☺   ")
            .setColor(0x00ff00)
            .setAuthor(member.user.username, member.user.avatarURL)
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()
            .addField("Bienvenue sur le serveur " + config.nomduserveur + " !", "")
            .addField('\u200B', '\u200B')
            .addField("Premium :", member.premium)
            .addField("Vérifié :", member.verified)
            .addField("Note :", member.note);

        member.guild.defaultChannel.send({
            embed
        });
    });

    //Catch des erreurs et retour
} catch (err) {

    logconsole("ERREUR CRITIQUE : ".red + err.message.red, 'error');
}
