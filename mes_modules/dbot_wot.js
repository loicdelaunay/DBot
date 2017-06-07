//** DBOT WOT : Api pour ma gestion des données du jeu WorldOfTanks **//




// Importation des APIs
const Discord = require('discord.js'); // api de discord
const Wargamer = require('wargamer').default; //api défaut de wargamer
const WorldOfTanks = require('wargamer').WorldOfTanks; //api extension de wargamer pour worldoftanks

//Initialisation du wargamer pour worldoftanks
const wot = Wargamer.WoT({
    realm: 'eu',
    applicationId: '9616efff59476333181678b1e112b9a3'
});

//Initialisation de la liste des maps (NOM)
const listemaps = ['Carélie',
'Live Oaks',
'Lakeville',
'LigneSiegfried',
'Mittengard',
'Abbaye'];
//Initialisation de la liste des maps (URL IMAGE)
const listemapsurl = ['http://wiki.wargaming.net/fr/Carélie',
'http://wiki.wargaming.net/fr/Live_Oaks',
'http://wiki.wargaming.net/fr/Lakeville',
'http://wiki.wargaming.net/fr/Ligne_Siegfried',
'http://wiki.wargaming.net/fr/Mittengard',
'http://wiki.wargaming.net/fr/Abbaye'];

var dbot_wot = function(){};             


//*aidewot affiche l'aide pour les commandes sur le jeu world of tanks
dbot_wot.prototype.aide = function(msg){
    const embed = new Discord.RichEmbed()
    .setTitle("   ❓   AIDE WOT:   ❓   ")
    .setColor(0x5d3217)
    .setDescription("Voici l'aide lié au jeu world of tanks")
    .setFooter('© D-BOT copyright Dream')
    .setTimestamp()

    .addField('\u200B', '\u200B')

    .addField('/wotstat "nomdujoueur" ou /wots "nomdujoueur"', "pour obtenir les stats wot du joueur recherché sur les sites les plus réputés.")
    .addField('/wottank "nomdutank" ou /wott "nomdutank"', "pour obtenir les informations du tank.")
    .addField('/wotrecherche "nomdujoueur ou /wotr "nomdujoueur"', "pour obtenir une liste des joueurs avec id de la BDD World Of Tanks.")

    embed.addField('\u200B', '\u200B')

    msg.channel.send({
        embed
    });
}

//*wotstats "nomdujoueur" ou *wots "nomdujoueur" pour avoir les stats du joueur
dbot_wot.prototype.wotstats = function(msg,nomdujoueur){
    const embed = new Discord.RichEmbed()
    .setTitle("   🎮   WOT : RECHERCHE DE STATS SUR : " + nomdujoueur.toUpperCase() + "   🎮   ")
    .setColor(0x3b3b3b)
    .setDescription("les stats wot du joueur : " + nomdujoueur + "recherchés sur les sites les plus réputés.")
    .setFooter('© D-BOT copyright Dream')
    .setTimestamp()

    .addField('\u200B', '\u200B')

    .addField('Par World Of Tanks', 'https://worldoftanks.eu/fr/community/accounts/#wot&at_search=' + args[0])
    .addField('Par WOT-LIFE', 'https://fr.wot-life.com/eu/player/' + nomdujoueur)
    .addField('Par WOT STAT', 'http://www.wotstats.org/stats/eu/' + nomdujoueur)
    .addField('Par NoobMeter', 'http://www.noobmeter.com/player/eu/' + nomdujoueur)

    embed.addField('\u200B', '\u200B')

    msg.channel.send({
        embed
    });
}

// Exportation de mon API
exports.dbot_wot = new dbot_wot();