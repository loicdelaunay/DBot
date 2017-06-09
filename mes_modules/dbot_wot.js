//** DBOT WOT : Api pour la gestion des données du jeu WorldOfTanks dans le DBOT**//



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

//*aidewot affiche l'aide pour les commandes sur le jeu world of tanks
exports.aide = function(msg){
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
exports.wotstats = function(msg,nomdujoueur){
    const embed = new Discord.RichEmbed()
    .setTitle("   🎮   WOT : RECHERCHE DE STATS SUR : " + nomdujoueur.toUpperCase() + "   🎮   ")
    .setColor(0x3b3b3b)
    .setDescription("les stats wot du joueur : " + nomdujoueur + "recherchés sur les sites les plus réputés.")
    .setFooter('© D-BOT copyright Dream')
    .setTimestamp()

    .addField('\u200B', '\u200B')

    .addField('Par World Of Tanks', 'https://worldoftanks.eu/fr/community/accounts/#wot&at_search=' + nomdujoueur)
    .addField('Par WOT-LIFE', 'https://fr.wot-life.com/eu/player/' + nomdujoueur)
    .addField('Par WOT STAT', 'http://www.wotstats.org/stats/eu/' + nomdujoueur)
    .addField('Par NoobMeter', 'http://www.noobmeter.com/player/eu/' + nomdujoueur)

    embed.addField('\u200B', '\u200B')

    msg.channel.send({
        embed
    });
}

//*wottank "nomdutank?" ou *wott "nomdutank?" pour avoir les information d'un tank
exports.wottank = function(msg,nomdutank){
    wot.get('encyclopedia/tanks', {
        language: 'fr'
    })
    .then(res => {
        resultat = res.data
        trouve = false;
        recherche = nomdutank;
        recherche = recherche.charAt(0).toUpperCase() + recherche.substring(1).toLowerCase();
        console.log(recherche);
        for (var i in resultat) {
            if (recherche == resultat[i].name_i18n || recherche == resultat[i].short_name_i18n) {
                affichetankinfo(i, msg);
                trouve = true;
                break;
            }
        }
        if (!trouve) {
            const embed = new Discord.RichEmbed()
            .setTitle("   🎮   WOT : ERREUR RECHERCE D'INFORMATION SUR LE TANK - " + nomdutank.toUpperCase() + " -   🎮   ")
            .setColor(0x3b3b3b)
            .setDescription("Recherche les informations sur un tank à partir de la base de donnée WorldOfTanks.")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

            .addField('ERREUR', "Le tank est introuvable, merci de vérifier l'orthographe")

            embed.addField('\u200B', '\u200B')

            msg.channel.send({
                embed
            });

        }
    })
}

//*wotinfo "nomdujoueur" ou *woti "nomdujoueur" pour avoir les information du joueur selon WorldOfTnkas
exports.wotinfo = function(msg,nomdujoueur){
    wot.get('account/info', {
        account_id: nomdujoueur
    })
    .then(res => {
        console.log(res);
        resultat = res.data[nomdujoueur];
        var dernierebataille = new Date(resultat.last_battle_time * 1000);

        const embed = new Discord.RichEmbed()
        .setTitle("   🎮   WOT : RECHERCE D'INFORMATION CONCERNANT - " + nomdujoueur.toUpperCase() + " -   🎮   ")
        .setColor(0x962d14)
        .setDescription("Recherche les informations sur un joueur à partir de la base de donnée WorldOfTanks")
        .setFooter('© D-BOT copyright Dream')
        .setTimestamp()

        .addField('\u200B', '\u200B')

        .addField("Langue : ", resultat.client_language)
        .addField("Dernière bataille : ", dernierebataille)
        .addField("Dernière bataille : ", dernierebataille)

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });

    })
}

//*wotrecherche "nomdujoueur" ou *wotr "nomdujoueur"  permet de lancer une recherche sur un joueur
exports.wotrecherche = function(msg,nomdujoueur){
    msgresultat = "";
    msgerreur = "";
    compteur = 0;
    listeresultat = ""
    if (nomdujoueur.length < 3) {
        const embed = new Discord.RichEmbed()
        .setTitle("   🎮   WOT : ERREUR RECHERCHE DU JOUEUR - " + nomdujoueur.toUpperCase() + " -   🎮   ")
        .setColor(0xce2020)
        .setDescription("Recherche les données sur un joueur à partir de la base de donnée WorldOfTanks")
        .setFooter('© D-BOT copyright Dream')
        .setTimestamp()

        .addField('\u200B', '\u200B')

        .addField("ERREUR : ", "Merci de faire une recherche avec un minimum de 3 caractères")

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });
    } else {
        wot.get('account/list', {
            search: nomdujoueur
        })
        .then(res => {
            console.log(res.data);

            res.data.forEach(function (ligne) {
                compteur += 1
            });
            console.log("Nombres de résultats : " + compteur);

            //Si il y a trop de résultat 
            if (compteur > 10 && compteur < 31) {
                res.data.forEach(function (ligne) {
                    listeresultat += "Nom du joueur : " + ligne.nickname + " Identifiant du joueur : " + ligne.account_id + "\n";
                });
                msg.channel.send("Trop de résultats ! mise en format brut : \n\n" + listeresultat + "\n Nombre de résultats : " + compteur + "\n Affichage sur le site web officiel : https://worldoftanks.eu/fr/community/accounts/#wot&at_search=" + args[0]);
            } else if (compteur > 31) {

                const embed = new Discord.RichEmbed()
                .setTitle("   🎮   WOT : ERREUR RECHERCHE DU JOUEUR - " + nomdujoueur.toUpperCase() + " -   🎮   ")
                .setColor(0xfa0000)
                .setDescription("Recherche les données sur un joueur à partir de la base de donnée WorldOfTanks")
                .setFooter('© D-BOT copyright Dream')
                .setTimestamp()

                .addField('\u200B', '\u200B')

                .addField("ERREUR : ", "Trop de résultats")
                .addField("RECHERCHE SUR LE SITE WORLD OF TANKS ?  : ", "https://worldoftanks.eu/fr/community/accounts/#wot&at_search=" + nomdujoueur)

                embed.addField('\u200B', '\u200B')

                msg.channel.send({
                    embed
                });
            } else {

                const embed = new Discord.RichEmbed()
                .setTitle("   🎮   WOT : RECHERCHE DU JOUEUR - " + nomdujoueur.toUpperCase() + " -   🎮   ")
                .setColor(0x5c1212)
                .setDescription("Recherche les données sur un joueur à partir de la base de donnée WorldOfTanks")
                .setFooter('© D-BOT copyright Dream')
                .setTimestamp()

                .addField('\u200B', '\u200B')
                res.data.forEach(function (ligne) {
                    embed.addField(ligne.nickname, "Identifiant du joueur : " + ligne.account_id)
                });
                embed.addField('\u200B', '\u200B')
                embed.addField("Nombre de résultat", compteur)

                msg.channel.send({
                    embed

                });

            }
        })
        .catch(err => {
            console.log(err.message);

            const embed = new Discord.RichEmbed()
            .setTitle("   🎮   WOT : ERREUR PENDANT LA RECHERCHE DU JOUEUR - " + nomdujoueur.toUpperCase() + " -  🎮   ")
            .setColor(0xff0000)
            .setDescription("Recherche les données sur un joueur à partir de la base de donnée WorldOfTanks")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('\u200B', '\u200B')

            .addField("Nom du joueur : ", nomdujoueur)
            .addField("ERREUR : ", err.message)
            .addField("RECHERCHE SUR LE SITE WORLD OF TANKS ?  : ", "https://worldoftanks.eu/fr/community/accounts/#wot&at_search=" + args[0])

            embed.addField('\u200B', '\u200B')

            msg.channel.send({
                embed

            });
        });
    }
}

//$affichetankinfo Affiche les informations du tank à l'id ID
function affichetankinfo(id, msg) {

    wot.get('encyclopedia/vehicleprofile', {
        tank_id: id
    })
    .then(res => {

        resultat = res.data[id]
        blindagetourelle = resultat.armor.turret.front + "/" + resultat.armor.turret.sides + "/" + resultat.armor.turret.rear;
        blindagechassis = resultat.armor.hull.front + "/" + resultat.armor.hull.sides + "/" + resultat.armor.hull.rear;

        wot.get('encyclopedia/tankinfo', {
            tank_id: id
        })
        .then(res => {
            resultat = res.data[id]
            imagetank = resultat.image;
            leveltank = resultat.level;
            nomdutank = resultat.short_name_i18n;

            const embed = new Discord.RichEmbed()
            .setTitle("   🎮   WOT : RECHERCE D'INFOS SUR LE TANK  - " + nomdutank + " -  🎮   ")
            .setColor(0xd32800)
            .setDescription("Recherche les informations sur un tank à partir de la base de donnée WorldOfTanks")
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()
            .setThumbnail(imagetank)

            .addField('\u200B', '\u200B')

            .addField("Nom du tank : ", nomdutank)
            .addField("Tier du tank : ", leveltank)
            .addField("Blindage de la tourelle : ", blindagetourelle)
            .addField("Blindage du chassis : ", blindagechassis)

            embed.addField('\u200B', '\u200B')

            msg.channel.send({
                embed
            });

        });

    });
}
