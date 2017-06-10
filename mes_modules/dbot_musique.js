//** DBOT MUSIQUE : Api pour la gestion des données musiques dans le DBOT**//

// Importation des APIs
const Discord = require('discord.js'); // api de discord
const fs = require('fs'); // api fs

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module Permission

exports.commande = function (msg, args, commande) {

    //*aidemusique affiche l'aide pour la gestion de la musique
    if (commande[0] == 'aidemusique' && dbot_permission.isadmin(msg.author.id)) {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("   ❓   AIDE MUSIQUE:   ❓   ")
            .setColor(0x179b2b)
            .setDescription("Voici l'aide pour la musique")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

            .addField('/musiqueimportytid "id de la musique" "nom du fichier importé', "pour importé une musique depuis youtube avec son id.")
            .addField('/musiqueimportyturl "url de la musique" "nom du fichier importé"', "pour importé une musique depuis youtube avec son url.")
            .addField('/musiqueplay "nomdelamusique"', "pour lire une musique dans le salon.")
            .addField('/musiquesplaybyurl "url"', "pour lire de la musique depuis une url.")
            .addField('/musiquestop', "pour stopper la musique.")
            .addField('/musiquelist', "retourne une liste de musique.")

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });
    }

    //*musiquelist -> Retourne une liste de toutes les musiques
    else if (commande[0] == 'musiquelist') {
        dbot_console.printConsoleCommande(msg);
        var listedesmusiques = "";
        fs.readdirSync("../DBOT/data/musiques").forEach(file => {
            listedesmusiques += file + "\n";
        })

        const embed = new Discord.RichEmbed()
            .setTitle("   🎶   VOICI LA LISTE DES MUSIQUES DISPONIBLE !   🎶   ")
            .setColor(0xbe2424)
            .setDescription('Voici la liste des musiques disponible')
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()
            .addField('Les musiques:', listedesmusiques)

        msg.channel.send({
            embed
        });
    }
    //*musiquestop stop la musique en cours (UTILISE UN HACK SON)
    else if (commande[0] == 'musiquestop' && dbot_permission.isadmin(msg.author.id)) {
        dbot_console.printConsoleCommande(msg);
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel.join().then(connection => { // 
                var musique1 = connection.playFile('');
                musique1.pause();
            }).catch(console.log);
        } else {
            msg.reply('Il faut dabord rejoindre un channel avant!');
        }
    }
    //*musiqueplay args[0] lance la musique avec args[0] = nom de la musique ex 1.mp3
    else if (commande[0] == 'musiqueplay' && dbot_permission.isadmin(msg.author.id)) {
        dbot_console.printConsoleCommande(msg);
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel.join().then(connection => { // 
                var musique1 = connection.playFile('./musique/' + args[0]);
                musique1.setVolume(0.5);
            }).catch(console.log);
        } else {
            msg.reply('Il faut dabord rejoindre un channel avant!');
        }
    }

    //*musiqueplaybyurl args[0] lance une musique par rapport à une url avec args[0] = url musique
    else if (commande[0] == 'musicplaybyurl') {
        dbot_console.printConsoleCommande(msg);
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel.join().then(connection => { // 
                try {
                    connection.playArbitraryInput(args[0].toString());
                } catch (e) {
                    msg.reply('Une erreur est survenue :' + e);
                }
            }).catch(console.log);
        } else {
            msg.reply('Il faut dabord rejoindre un channel avant!');
        }
    }
}
