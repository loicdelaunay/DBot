//** DBOT WOT : Api pour la gestion des modules divers du DBOT**//

// Importation des APIs
const Discord = require('discord.js'); // api de discord

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console


exports.commande = function (msg, args, commande) {

    //*close -> Arrete le bot
    if (commande[0] == 'close' && msg.author.id == admin) {
        dbot_console.printConsoleCommande(msg);

        //TODO
    }

    //*restart -> Relance le bot
    else if (commande[0] == 'restart' && msg.author.id == admin) {
        dbot_console.printConsoleCommande(msg);

        const spawn = child_process.spawn;
        const bat = spawn('cmd.exe', ['/c', 'startbot.bat']);

        msg.reply('Restart en cours ....')

        bat.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        bat.stderr.on('data', (data) => {
            console.log(data.toString());
        });

        bat.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });

        msg.reply("Restart Okay, fermeture de l 'ancienne méthode, merci de patienter 3 secondes")
    }

    //*online -> affiche le temps depuis lequel le bot est en ligne
    else if (commande[0] == 'online') {
        dbot_console.printConsoleCommande(msg);

        //TODO
    }

    //*stop -> Arrete le bot
    else if (commande[0] == 'stop' && dbot_permission.isadmin(msg.author.id)) {
        dbot_console.printConsoleCommande(msg);

        process.exit(-1);
    }

    //*datecreation affiche la date de création du client
    else if (commande[0] == 'datecreation') {
        dbot_console.printConsoleCommande(msg);

        msg.reply('Votre compte a ete cree le : ' + msg.author.createdAt);
    }

    //*ping -> donne le ping du joueur
    else if (commande[0] == 'ping') {
        dbot_console.printConsoleCommande(msg);

        msg.reply("Ton ping est de : " + msg.author.client.ping + "ms");
    }

    //*myavatar -> affiche l'image de l'avatar du joueur
    else if (commande[0] == 'myavatar') {
        dbot_console.printConsoleCommande(msg);

        msg.reply('Voici le lien vers votre avatar : ' + msg.author.avatarURL);
    }

    //*spam -> Commande de test permet de spammer un chat
    else if (commande[0] == 'spam' && msg.author.id === admin) {
        dbot_console.printConsoleCommande(msg);
        for (var i = 0; i < args[0]; i++) {
            msg.reply('D-BOT MOD SPAM');
        }
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

            .addField('Votre ID :', msg.author.id)

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
                embed.addField('Le dé ' + (i + 1) + ' est sur la face : ', random(args[1]))
                total += random(args[1]);
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
