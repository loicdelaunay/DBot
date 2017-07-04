//** DBOT WOT : Api pour la gestion des modules divers du DBOT**//

// Version du D-BOT avec export
const version = "0.9.2";
exports.version = function () {
    return version;
}

// Importation des APIs
const Discord = require('discord.js'); // api de discord
const path = require('path'); // api de gestion des chemins d'accès

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module Permission

// Dossier de lancement du bot
var appDir = path.dirname(require.main.filename);
exports.dossierRoot = function () {
    return appDir;
}

// Dossier executable ffmpeg 
var ffmpegPath = appDir + '/prerequis/ffmpeg/bin/ffmpeg.exe'
exports.dossierFfmpeg = function () {
    return ffmpegPath;
}

exports.commande = function (msg, args, commande) {

    //*aidedivers ou *aided -> affiche l'aide global
    if (commande[0] == 'aidedivers' || commande[0] == 'aided') {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("   ❓   AIDE DIVERS:   ❓   ")
            .setColor(0x177d9b)
            .setDescription("Voici l'aide global du bot")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

            .addField('/myavatar', "pour avoir un lien vers votre avatar.")
            .addField('/ping', "pour obtenir votre ping.")
            .addField('/monid', "pour obtenir votre id.")
            .addField('/datecreation', "pour obtenir la date de création de votre compte discord.")
            .addField('/roll "nombre de dés" "nombre de face du dé"', "pour jeter X dès à X faces.")
            .addField('/info', "pour obtenir les informations concernant le D-BOT.")

        //si l'utilisateur a les droits administrateurs
        if (dbot_permission.isadmin(msg.author.id)) {
            embed
                .addField('\u200B', '\u200B')
                .addField('Commandes Admin', 'Ci dessous les commandes admin : ')
                .addField('/say', "Fait parler le bot dans un channel.")
                .addField('/block "nom"', "pour bloquer un utilisateur.")
                .addField('/unblock "nom"', "pour débloquer un utilisateur.")
                .addField('/restart', "pour restart le bot.")
                .addField('/close', "pour fermer le bot.")
        }

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });
    }

    //*close -> Arrete le bot
    else if (commande[0] == 'close' && msg.author.id == admin) {
        dbot_console.printConsoleCommande(msg);

        //TODO
    }

    //*restart -> Relance le bot
    else if (commande[0] == 'restart' && msg.author.id == admin) {
        //TODO
        //        dbot_console.printConsoleCommande(msg);
        //
        //        const spawn = child_process.spawn;
        //        const bat = spawn('cmd.exe', ['/c', 'startbot.bat']);
        //
        //        msg.reply('Restart en cours ....')
        //
        //        bat.stdout.on('data', (data) => {
        //            console.log(data.toString());
        //        });
        //
        //        bat.stderr.on('data', (data) => {
        //            console.log(data.toString());
        //        });
        //
        //        bat.on('exit', (code) => {
        //            console.log(`Child exited with code ${code}`);
        //        });
        //
        //        msg.reply("Restart Okay, fermeture de l 'ancienne méthode, merci de patienter 3 secondes")
    }

    //*online -> affiche le temps depuis lequel le bot est en ligne
    else if (commande[0] == 'online') {
        dbot_console.printConsoleCommande(msg);

        //TODO
    }

    //*stop -> Arrete le bot
    else if (commande[0] == 'stop' && dbot_permission.isadmin(msg.author.id)) {
        dbot_console.printConsoleCommande(msg);

        msg.reply("Arrêt du bot ...")
        process.exit(-1);
    }

    //*datecreation affiche la date de création du client
    else if (commande[0] == 'datecreation') {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("   📅   DATE CREATION:   📅   ")
            .setColor(0xdbae34)
            .setDescription("Affiche la date de creation de votre compte Discord !")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')
            //TODO : mettre en forme la DATE
            .addField('Ton compte a été créé le : ', msg.author.createdAt)

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });
    }

    //*ping -> donne le ping du joueur
    else if (commande[0] == 'ping') {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("   ⛗   PING:   ⛗   ")
            .setColor(0xdbae34)
            .setDescription("Affiche votre ping moyen avec le serveur Discord !")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')
            .addField('Ton ping moyen est de : ', msg.author.client.ping + "ms")

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });
    }

    //*myavatar -> affiche l'image de l'avatar du joueur
    else if (commande[0] == 'myavatar') {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("   ⚇   VOTRE AVATAR DISCORD:   ⚇   ")
            .setColor(0xdbae34)
            .setDescription("Affiche votre avatar Discord !")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

            .addField('Voici le lien vers votre avatar : ', msg.author.avatarURL)
            .setImage(msg.author.avatarURL)

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });
    }

    //*info -> donne les infos du bot
    else if (commande[0] == 'info') {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("   ✎   INFORMATION SUR LE D-BOT:   ✎   ")
            .setColor(0xdbae34)
            .setDescription("Le D-BOT est un bot discord basé sur DISCORD.JS développé par Dream il a pour but d'être un vrai couteau suisse !")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

            .addField('Version du D-BOT : ', version)
            .addField('Version de Discord.JS utilisé : ', Discord.version)
            .addField('Version de Node utilisé : ', process.version)

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });
    }

    //*monid -> affiche l'id de l'utilisateur qui éxécute la commande
    else if (commande[0] == 'monid') {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("   ⚀   VOTRE ID:   ⚀   ")
            .setColor(0xc9c9c9)
            .setDescription("Affiche votre identifiant Discord")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

            .addField('Ton ID :', msg.author.id)

            .addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });
    }

    //*roll "nombre de dés" "nombres de faces" -> jette args[0] dès a args[1] faces
    //FIXME: le nombre total ne correspond au total des dés
    else if (commande[0] == 'roll') {
        //Vérifie que l'utilisateur est entrer un minimum de paramètre sinon set les paramètres par défaut
        if (args[0] == null) {
            args[0] = 1;
        }
        if (args[1] == null) {
            args[1] = 6;

        }
        if (args[0] > 10 || args[1] > 64) {
            const embed = new Discord.RichEmbed()
                .setTitle("   ⚀   JET DE DES:   ⚀   ")
                .setColor(0xc9c9c9)
                .setDescription("ERREUR")
                .setFooter('© D-BOT copyright Dream')
                .setTimestamp()
                .setThumbnail('https://cdn.pixabay.com/photo/2012/04/16/11/48/dice-35637_960_720.png')

                .addField('\u200B', '\u200B')

                .addField('Maximum 10 dés et 64 faces')

                .addField('\u200B', '\u200B')

            msg.channel.send({
                embed
            });
        } else {
            const embed = new Discord.RichEmbed()
                .setTitle("   ⚀   JET DE DES:   ⚀   ")
                .setColor(0xc9c9c9)
                .setDescription("Jet de " + args[0] + " dé(s) à " + args[1] + " faces")
                .setFooter('© D-BOT copyright Dream')
                .setTimestamp()
                .setThumbnail('https://cdn.pixabay.com/photo/2012/04/16/11/48/dice-35637_960_720.png')

                .addField('\u200B', '\u200B')

            var total = 0;
            for (var i = 0; i < args[0]; i++) {
                nbrrandom = random(args[1])
                embed.addField('Le dé ' + (i + 1) + ' est sur la face : ', nbrrandom)
                total += nbrrandom;
            }
            embed.addField('\u200B', '\u200B')
            embed.addField('Total des dés : ', total);


            embed.addField('\u200B', '\u200B')

            msg.channel.send({
                embed
            });
        }
    }
}

// Retourne un integral aléatoire compris entre 0 et max 
function random(max) {
    return Math.floor((Math.random() * max) + 1);
}
exports.random = function (max) {
    return random(max)
}

// Retourne le dernier mot
exports.derniermot = function (mot) {
    var n = mot.split(" ");
    return n[n.length - 1];
}
