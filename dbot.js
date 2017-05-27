//***** D BOT *****//

//* pour rechercher les commandes ctrl + f
//$ pour rechercher les fonctions avec ctrl + f

// Importation des APIs
const Discord = require('discord.js'); // api de discord
const fs = require('fs'); //api nodejs pour gestion des fichiers
const dateTime = require('node-datetime'); //api pour la gestion du temps
const child_process = require('child_process'); //api pour gérer les processus
const YoutubeMp3Downloader = require('youtube-mp3-downloader'); //api pour télécharger des mp3 depuis youtube
const getYouTubeID = require('get-youtube-id');
const colors = require('colors'); // api pour gérer la couleur dans la console 
const Wargamer = require('wargamer').default; //api défaut de wargamer
const WorldOfTanks = require('wargamer').WorldOfTanks; //api extension de wargamer pour worldoftanks


//Chargement du fichier de configuration du D-BOT
const config = require('./dbot_config.json');

//Version du D-BOT
var version = 0.4;

//Chargement du fichier de tournoi
const tournoi = require('./data/tournoi/tournoi.json');
const tournoiparticipant = tournoi.participants;

//Initialisation de la liste des maps
const listemaps = ['Carélie',
       'Live Oaks',
       'Lakeville',
       'LigneSiegfried',
       'Mittengard',
       'Abbaye'];
const listemapsurl = ['http://wiki.wargaming.net/fr/Carélie',
       'http://wiki.wargaming.net/fr/Live_Oaks',
       'http://wiki.wargaming.net/fr/Lakeville',
       'http://wiki.wargaming.net/fr/Ligne_Siegfried',
       'http://wiki.wargaming.net/fr/Mittengard',
       'http://wiki.wargaming.net/fr/Abbaye'];

//Initialisation du wargamer pour worldoftanks
const wot = Wargamer.WoT({
    realm: 'eu',
    applicationId: '9616efff59476333181678b1e112b9a3'
});

//Initialisation de l'api youtube
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": config.ffmpeg_path, // Where is the FFmpeg binary located? 
    "outputPath": "./musique", // Where should the downloaded and encoded files be stored? 
    "youtubeVideoQuality": "highest", // What video quality should be used? 
    "queueParallelism": 2, // How many parallel downloads/encodes should be started? 
    "progressTimeout": 4000 // How long should be the interval of the progress reports 
});

//Initialisation des couleurs du thème de la console
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
const client = new Discord.Client();
const entete = '\n********************** LANCEMENT DU D-BOT ' + version + ' ... ***********************\n\n'
console.log(entete.bgWhite.black);

console.log('Version du D-BOT : ' + version);
console.log('Chemin de ffmpegPath utilisé : ' + config.ffmpeg_path);

//Token du bot 
const token = config.token;
console.log('Token utilisé : ' + config.token);

//Prefix des commandes du bot
const prefix = config.prefix;
console.log('Prefix des commandes utilisé : ' + config.prefix);

//Id Admin
const admin = config.idadmin;
console.log('Id admin chargé : ' + config.idadmin);

const entete2 = '\n********************** FICHIER DE CONFIGURATION ***********************\n\n'
console.log(entete2.bgWhite.black);

//Connection
client.login(token);

// A la conncetion du bot
client.on('ready', () => {
    var dt = dateTime.create();
    var heurestart = dt.format('d-m-Y H:M:S');
    client.user.setStatus("online");
    client.user.setGame("/aide pour obtenir de l'aide");
    logconsole('Le D-BOT est fonctionnel ! ' + heurestart, 'debug');
});



try {

    // Quand le bot recoit un message
    client.on('message', msg => {

        var dt = dateTime.create();
        var formatted = dt.format('d-m-Y H:M:S');
        addlogmessage("L'utilisateur : " + msg.author.username + ' Avec ID : ' + msg.author.id + ' a posté le message suivant : ' + msg.content + ' posté le : ' + formatted + '\n');

        if (derniermot(msg.content) === 'ping') {
            msg.reply('Pong!');
            console.log('Blague : pong effectué !');
        } else if (msg.content === 'AH!') {
            msg.reply('https://i.ytimg.com/vi/HdZ5OD1KMGs/hqdefault.jpg');
            console.log('Blague : AH! effectué !');
        } else if (derniermot(msg.content) === 'quoi' ||
            derniermot(msg.content) === 'quoi?') {
            msg.reply('feur');
        } else if (derniermot(msg.content) === 'comment') {
            msg.reply('dant coustaud');
        } else if (derniermot(msg.content) === 'hein') {
            msg.reply('deux');
        }

        //*ia "message" utilise l'api cleverbot pour repondre à un message
        if (msg.content.startsWith('*')) {
            var cleverbot = require('cleverbot-node');
            cleverbot = new cleverbot();
            cleverbot.configure({
                botapi: "CC26pVh6I-nrtGiKVW6KQ55XV_g"
            });
            cleverbot.write(msg.content.substring(0), function (response) {
                msg.reply(response.output);
            });
        }

    });


    // Quand le bot recoit une commande
    client.on('message', msg => {
        //decoupe le message en argument
        var args = msg.content.split(" ").slice(1);

        //decoupage du message pour récupérer la commande
        if (msg.content.startsWith(prefix)) {
            //recupération de la commande
            var commande = msg.content;
            var commande = commande.substring(1);
            var commande = commande.split(" ").slice(0);
            //login a une date
            var dt = dateTime.create();
            var formatted = dt.format('d-m-Y H:M:S');
            addlogcommande("L'utilisateur : " + msg.author.username + ' Avec ID : ' + msg.author.id + ' a utilisé la commande suivante : ' + msg.content + ' posté le : ' + formatted + '\n');
        } else {
            var commande = '';
        }

        //Les aides 

        if (msg.content.startsWith(prefix)) {
            //*aide affiche l'aide disponible  
            if (commande[0] == 'aide' || commande[0] == '?') {
                logcommande(msg);

                const embed = new Discord.RichEmbed()
                    .setTitle("   ❓   AIDE :   ❓   ")
                    .setColor(0x244dbe)
                    .setDescription("Voici l'aide de l'aide")
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()

                    .addField('\u200B', '\u200B')

                    .addField('*', "pour parler avec l 'ia du bot taper * avant votre message")
                    .addField('/aideg', "pour obtenir l'aide générale")
                    .addField('/aidewot', "pour obtenir l'aide à propos des commandes World Of Tanks")

                if (msg.author.id == admin) {
                    embed
                        .addField('/aideadmin', "pour obtenir l'aide admin")
                        .addField('/aidemusique', "pour obtenir l'aide sur la gestion des musiques")
                        .addField('/aidetournoi', "pour obtenir l'aide sur la gestion des tournois")
                }

                embed.addField('\u200B', '\u200B')
                msg.channel.send({
                    embed
                });


            }

            //*aideadmin affiche l'aide pour les admins
            else if (commande[0] == 'aideadmin' && msg.author.id == admin) {
                logcommande(msg);

                const embed = new Discord.RichEmbed()
                    .setTitle("   ❓   AIDE ADMIN:   ❓   ")
                    .setColor(0xbe2424)
                    .setDescription("Voici l'aide pour les admins")
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()

                    .addField('\u200B', '\u200B')

                    .addField('/say', "Fait parler le bot dans un channel.")
                    .addField('/block "nom"', "pour bloquer un utilisateur.")
                    .addField('/unblock "nom"', "pour débloquer un utilisateur.")
                    .addField('/restart', "pour restart le bot.")
                    .addField('/close', "pour fermer le bot.")

                embed.addField('\u200B', '\u200B')

                msg.channel.send({
                    embed
                });
            }

            //*aidemusique affiche l'aide pour la gestion de la musique
            else if (commande[0] == 'aidemusique' && msg.author.id == admin) {
                logcommande(msg);

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

            //*aideg affiche l'aide global
            else if (commande[0] == 'aideg') {
                logcommande(msg);

                const embed = new Discord.RichEmbed()
                    .setTitle("   ❓   AIDE GENERALES:   ❓   ")
                    .setColor(0x177d9b)
                    .setDescription("Voici l'aide global du bot")
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()

                    .addField('\u200B', '\u200B')

                    .addField('/myavatar', "pour avoir un lien vers votre avatar.")
                    .addField('/ping', "pour obtenir votre ping.")
                    .addField('/monid', "pour obtenir votre id.")
                    .addField('/datecreation', "pour obtenir la date de création de votre compte discord.")
                    .addField('/roll "nombre de dés" "nombre de face du dé"', "pour jetter X dès à X faces.")
                    .addField('/info', "pour obtenir les informations concernant le D-BOT.")

                embed.addField('\u200B', '\u200B')

                msg.channel.send({
                    embed
                });
            }

            //*aidewot affiche l'aide pour les commandes sur le jeu world of tanks
            else if (commande[0] == 'aidewot') {
                logcommande(msg);

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
            else if (commande[0] == 'wotstat' || commande[0] == 'wots') {
                logcommande(msg);

                const embed = new Discord.RichEmbed()
                    .setTitle("   🎮   WOT : RECHERCHE DE STATS SUR : " + commande[0].toUpperCase() + "   🎮   ")
                    .setColor(0x3b3b3b)
                    .setDescription("les stats wot du joueur : " + commande[0] + "recherchés sur les sites les plus réputés.")
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()

                    .addField('\u200B', '\u200B')

                    .addField('Par World Of Tanks', 'https://worldoftanks.eu/fr/community/accounts/#wot&at_search=' + args[0])
                    .addField('Par WOT-LIFE', 'https://fr.wot-life.com/eu/player/' + args[0])
                    .addField('Par WOT STAT', 'http://www.wotstats.org/stats/eu/' + args[0])
                    .addField('Par NoobMeter', 'http://www.noobmeter.com/player/eu/' + args[0])

                embed.addField('\u200B', '\u200B')

                msg.channel.send({
                    embed
                });
            }

            //*wottank "nomdutank?" ou *wott "nomdutank?" pour avoir les information d'un tank
            else if (commande[0] == 'wottank' || commande[0] == 'wott') {
                logcommande(msg);

                wot.get('encyclopedia/tanks', {
                        language: 'fr'
                    })
                    .then(res => {
                        resultat = res.data
                        trouve = false;
                        recherche = args[0];
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
                                .setTitle("   🎮   WOT : ERREUR RECHERCE D'INFORMATION SUR LE TANK - " + args[0].toUpperCase() + " -   🎮   ")
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
            else if (commande[0] == 'wotinfo' || commande[0] == 'woti') {
                logcommande(msg);
                wot.get('account/info', {
                        account_id: args[0]
                    })
                    .then(res => {
                        console.log(res);
                        resultat = res.data[args[0]];
                        var dernierebataille = new Date(resultat.last_battle_time * 1000);

                        const embed = new Discord.RichEmbed()
                            .setTitle("   🎮   WOT : RECHERCE D'INFORMATION CONCERNANT - " + args[0].toUpperCase() + " -   🎮   ")
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
            else if (commande[0] == 'wotrecherche' || commande[0] == 'wotr') {
                logcommande(msg);
                msgresultat = "";
                msgerreur = "";
                compteur = 0;
                listeresultat = ""
                if (args[0].length < 3) {
                    const embed = new Discord.RichEmbed()
                        .setTitle("   🎮   WOT : ERREUR RECHERCHE DU JOUEUR - " + args[0].toUpperCase() + " -   🎮   ")
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
                            search: args[0]
                        })
                        .then(res => {

                            logconsole('Commande ' + commande[0] + ' éxécutée', 'info', msg);
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
                                    .setTitle("   🎮   WOT : ERREUR RECHERCHE DU JOUEUR - " + args[0].toUpperCase() + " -   🎮   ")
                                    .setColor(0xfa0000)
                                    .setDescription("Recherche les données sur un joueur à partir de la base de donnée WorldOfTanks")
                                    .setFooter('© D-BOT copyright Dream')
                                    .setTimestamp()

                                    .addField('\u200B', '\u200B')

                                    .addField("ERREUR : ", "Trop de résultats")
                                    .addField("RECHERCHE SUR LE SITE WORLD OF TANKS ?  : ", "https://worldoftanks.eu/fr/community/accounts/#wot&at_search=" + args[0])

                                embed.addField('\u200B', '\u200B')

                                msg.channel.send({
                                    embed
                                });
                            } else {

                                const embed = new Discord.RichEmbed()
                                    .setTitle("   🎮   WOT : RECHERCHE DU JOUEUR - " + args[0].toUpperCase() + " -   🎮   ")
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
                            logconsole('Commande ' + commande[0] + ' éxécutée', 'info', msg);
                            console.log(err.message);

                            const embed = new Discord.RichEmbed()
                                .setTitle("   🎮   WOT : ERREUR PENDANT LA RECHERCHE DU JOUEUR - " + args[0].toUpperCase() + " -  🎮   ")
                                .setColor(0xff0000)
                                .setDescription("Recherche les données sur un joueur à partir de la base de donnée WorldOfTanks")
                                .setFooter('© D-BOT copyright Dream')
                                .setTimestamp()

                                .addField('\u200B', '\u200B')

                                .addField("Nom du joueur : ", args[0])
                                .addField("ERREUR : ", err.message)
                                .addField("RECHERCHE SUR LE SITE WORLD OF TANKS ?  : ", "https://worldoftanks.eu/fr/community/accounts/#wot&at_search=" + args[0])

                            embed.addField('\u200B', '\u200B')

                            msg.channel.send({
                                embed

                            });
                        });
                }
            }

            //*info donne les infos du bot
            else if (commande[0] == 'info') {
                logcommande(msg);

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

            //*spam Commande de test, permet de spammer un chat
            else if (commande[0] == 'spam' && msg.author.id === admin) {
                logcommande(msg);
                for (var i = 0; i < args[0]; i++) {
                    msg.reply('D-BOT MOD SPAM');
                }
            }

            //*roll "nombre de dés" "nombres de faces" jette X dès a X faces
            else if (commande[0] == 'roll') {
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

            //*monid affiche l'id de l'utilisateur
            else if (commande[0] == 'monid') {
                logcommande(msg);

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


            //*register enregistre l'utilisateur dans la BDD local
            else if (commande[0] == 'register') {
                logcommande(msg);
                msg.reply('Tu a bien été enregistré comme membre sur le D-BOT : ' + msg.author.username);
                var info = msg.author.id + ', 0, 0';
                var file = fs.writeFile('./data/' + msg.author.id + '.txt', JSON.stringify(info), function (err) {
                    if (err) {
                        console.log('Erreur :( ' + err);
                    }
                });
            }

            //*mesinfos renseigne les information du joueur par rapport a la BDD du serveur
            else if (commande[0] == 'mesinfos') {
                logcommande(msg);
                var infos = information(msg.author.id);
                msg.reply('\Ton ID : ' + infos[0] + '\Ton sel : ' + infos[1] + '\Ton niveau : ' + infos[2]);
            }

            //*ping donne le ping du joueur
            else if (commande[0] == 'ping') {
                logcommande(msg);
                msg.reply("Ton ping est de : " + msg.author.client.ping + "ms");
            }

            //*close arrete le bot
            else if (commande[0] == 'close' && msg.author.id == admin) {
                logcommande(msg);
                msg.reply('Fermeture en cours ...')
                setTimeout(exitvalidation(msg), 2000);
            }

            //*restart relance le bot
            else if (commande[0] == 'restart' && msg.author.id == admin) {
                logcommande(msg);
                msg.reply('Restart en cours ....')
                restart();
                msg.reply("Restart Okay, fermeture de l 'ancienne méthode, merci de patienter 3 secondes")
                setTimeout(exit, 3000);
            }

            //*online affiche le temps depuis lequel le bot est en ligne
            else if (commande[0] == 'online') {
                logcommande(msg);
                msg.reply("Je suis en ligne depuis : " + heurestart);
            }

            //*myavatar affiche l'image de l'avatar du joueur
            else if (commande[0] == 'myavatar') {
                logcommande(msg);
                msg.reply('Voici le lien vers votre avatar : ' + msg.author.avatarURL);
            }

            //*datecreation affiche la date de création du client
            else if (commande[0] == 'datecreation') {
                logcommande(msg);
                msg.reply('Votre compte a ete cree le : ' + msg.author.createdAt);
            }

            //*tournoiinit initialise à zéro le tournoi
            else if (commande[0] == 'tournoiinit' && msg.author.id == admin) {
                logcommande(msg);
                msg.reply('Le tournoi à bien été initialisé');
            }

            //*tournoiadd args[0] = nom du joueur ajoute un joueur à la liste des participant du tournoi
            else if (commande[0] == 'tournoiadd' && msg.author.id == admin) {
                logcommande(msg);
                msg.reply('Le joueur : ' + args[0] + 'a bien été rajouté au tournoi');
            }

            //*tournoirule = nom du joueur ajoute un joueur à la liste des participant du tournoi
            else if (commande[0] == 'tournoirule') {
                logcommande(msg);
                const embed = new Discord.RichEmbed()
                    .setTitle("   	🏆   VOICI L'ORGANISATION DES TOURNOIS INTRA DOTY !   	🏆   ")
                    .setColor(0x00AE86)
                    .setDescription('Ici vous trouverez toutes les règles/informations concernant les tournois de la DOTY')
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()
                    .setThumbnail('http://www.loicdelaunay.fr/projets/dbot/tournoilogo.png')

                    .addField('Information 1:', '- Les matchs sont organisés automatiquement par le script du D-BOT.')

                    .addField('Information 2:', '- La map sélectionnée sera aussi choisie parmi une liste dans le script du D-BOT ( cette liste sera fournie pendant la création du tournoi ).')

                    .addField('Information 3:', "- Le match sera composé des deux équipes et d'un arbitre + un contre arbitre si possible.")

                    .addField('Information 4:', '- Les arbitres sont les joueurs haut gradés du clan DOTY de même pour les contres arbitres.')

                    .addField('Information 5:', "- Le contre-arbitre veillera au bon déroulement des matchs et fera part de toute remarque à l'organisateur du tournoi.")

                    .addField('Information 6:', "- Chaque match s'organise en 3 rounds ! Défaite du match = élimination du tournoi.")

                    .addField('Information 7:', '- Des informations complémentaires seront données à la création du tournoi.')

                    .addField('Information 8:', '- Les heures du tournoi seront données à sa création, une absence amènera à une disqualification immédiate.')

                    .addField('Déroulement:', "- L'arbitre créera une salle d'entraînement, invitera les joueurs et mettra la map choisie par le D-BOT par la suite, chaque équipe enverra en MESSAGE PRIVEE à l'arbitre le tank choisi sans l'avoir sélectionné, quand les deux équipes ont fini de choisirleurs tanks ils pourront se mettre prêt et ne pourront plus changer de tank, l'arbitre vérifiera que celui-ci correspond bien au tank cité précédemment.")


                msg.channel.send({
                    embed
                });
            }

            //*tournoistart
            else if (commande[0] == 'tournoistart' && msg.author.id == admin) {
                logcommande(msg);


                var listedesmatchs = ""
                var compteur = 0;
                var listedesjoueurs = tournoiparticipant;

                var embed = new Discord.RichEmbed()
                embed.addField('\u200B', '\u200B')

                while (listedesjoueurs.length > 1) {
                    compteur++;
                    var joueurselectionne = random(listedesjoueurs.length - 2);
                    var equipe1 = listedesjoueurs[joueurselectionne];
                    listedesjoueurs.splice(joueurselectionne, 1);
                    var joueurselectionne = random(listedesjoueurs.length - 2);
                    var equipe2 = listedesjoueurs[joueurselectionne];
                    listedesjoueurs.splice(joueurselectionne, 1);
                    var mapselectionnee = random(listemaps.length)

                    //gestion de l'affichage
                    embed.addField('⚔ Match N°' + compteur, 'le joueur : #' + equipe1 + " va affronter : #" + equipe2 + ' sur la map : ' + '[' + listemaps[mapselectionnee] + ']' + '(' + listemapsurl[mapselectionnee] + ')');
                }

                embed
                    .setTitle("   🔱   " + tournoi.nomtournoi + "   🔱   ")
                    .setColor(0xafaf26)
                    .setDescription('Voici la liste des matchs:')
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()

                embed.addField('\u200B', '\u200B')

                msg.channel.send({
                    embed
                });

            }

            //*musiqueimportytid args[0] = id de la vidéo args[1] = nom de l'enregistrement
            else if (commande[0] == 'musiqueimportytid' && msg.author.id == admin) {
                logcommande(msg);
                YD.download(args[0], args[1]);
                msg.reply('Importation de la vidéo youtube avec id : ' + args[0] + ' sous le nom de : ' + args[1]);
            }

            //*musiqueimportyturl args[0] = url de la vidéo args[1] = nom de l'enregistrement
            else if (commande[0] == 'musiqueimportyturl' && msg.author.id == admin) {
                logcommande(msg);
                var id = getYouTubeID(args[0]);
                YD.download(id, args[1]);
                msg.reply('Importation de la vidéo youtube avec id : ' + args[0] + ' sous le nom de : ' + args[1]);
            }

            //*musiquelist Retourne une liste de toutes les musiques
            else if (commande[0] == 'musiquelist') {
                logcommande(msg);
                var listedesmusiques = "";
                fs.readdirSync("./musique").forEach(file => {
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
            else if (commande[0] == 'musiquestop' && msg.author.id == admin) {
                logcommande(msg);
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
            else if (commande[0] == 'musiqueplay' && msg.author.id == admin) {
                logcommande(msg);
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
                logcommande(msg);
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

            //*block args[0] met en prison un client args[0] = client
            else if (commande[0] == 'block') {
                logcommande(msg);
                msg.reply('Le rageux : ' + args[0] + ' a bien été bloque');
            }

            //*unblock args[0] sort de prison un client args[0] = client
            else if (commande[0] == 'unblock') {
                logcommande(msg);
                msg.reply('Le rageux : ' + args[0] + ' a bien ete debloque');
            } else {
                logconsole('Commande inconnu : ' + commande[0] + ' essayé', 'info', msg);

                const embed = new Discord.RichEmbed()
                    .setTitle("   ⚠   COMMANDE INTROUVABLE:   ⚠   ")
                    .setColor(0xafaf26)
                    .setDescription("La commande : /" + commande[0] + " n'a pas été reconnu")
                    .setFooter('© D-BOT copyright Dream')
                    .setTimestamp()

                    .addField('\u200B', '\u200B')

                    .addField('/aide', "pour voir les commandes disponibles sur le D-BOT.")

                embed.addField('\u200B', '\u200B')

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
            .addField("Bienvenue sur le serveur DreamOfTheYear !")

        member.guild.defaultChannel.send({
            embed
        });
    });

    //gestion de l'api de YOutubeMp3
    YD.on("finished", function (data) {
        logconsole("Le téléchargement de l'import Youtube est terminé", 'green');
    });

    YD.on("error", function (error) {
        logconsole(error, 'error');
    });

    YD.on("progress", function (progress) {
        logconsole("Téléchargement en cours de l'import Youtube ...", 'info');
    });

    //Fonction retourne le dernier mot
    function derniermot(mot) {
        var n = mot.split(" ");
        return n[n.length - 1];
    }

    //Fonction tableau informations de l'utilisateur
    function information(idauteur) {
        var fichierinfo = fs.readFileSync('./data/' + idauteur + '.txt', 'utf8');
        fichierinfo = fichierinfo.substring(1);
        fichierinfo = fichierinfo.substring(0, fichierinfo.length - 1);
        var infos = fichierinfo.split(",").slice();
        return infos;
    }

    //Fonction appendlog
    function addlogmessage(text) {
        var dt = dateTime.create();
        var formatted = dt.format('d-m-Y');
        fs.appendFileSync('./logs/messages/logmessages' + formatted + '.txt', text);
    }

    function addlogcommande(text) {
        var dt = dateTime.create();
        var formatted = dt.format('d-m-Y');
        fs.appendFileSync('./logs/commandes/logcommandes' + formatted + '.txt', text);
    }

    function addlogerreurs(text) {
        var dt = dateTime.create();
        var formatted = dt.format('d-m-Y');
        fs.appendFileSync('./logs/erreurs/logerreurs' + formatted + '.txt', text);
    }

    //Fonction timer
    function timer() {
        // traitement
        setTimeout(tafonction, 2000); /* rappel après 2 secondes = 2000 millisecondes */
    }

    function exit() {
        process.exit(-1);
    }

    function exitvalidation(msg) {
        msg.reply("Fin de l'éxécution du D-BOT")
        process.exit(-1);
    }

    function isadmin(client) {
        if (client == admin) {
            return true;
        } else {
            return false;
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

        //Afiichage des résultats

    }

    function restart() {
        const spawn = child_process.spawn;
        const bat = spawn('cmd.exe', ['/c', 'startbot.bat']);

        bat.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        bat.stderr.on('data', (data) => {
            console.log(data.toString());
        });

        bat.on('exit', (code) => {
            console.log(`Child exited with code ${code}`);
        });
    }


    //$logconsole Gestion des messages de log avec couleur et formatage
    function logconsole(msg, type, objetmessage) {
        var dt = dateTime.create();
        var formatted = dt.format('d/m-H:M');
        log = '['.cyan + formatted.cyan + '] :'.cyan + ' ' + msg;
        if (objetmessage != null) {
            log += ' par : ' + objetmessage.author.username + ' ' + objetmessage.author.id;
        }
        switch (type) {
            case 'input':
                log += ' (input)'.input;
                break;
            case 'info':
                log += ' (info)'.info;
                break;
            case 'help':
                log += ' (help)'.help;
                break;
            case 'warn':
                log += ' (warn)'.warn;
                break;
            case 'debug':
                log += ' (debug)'.debug;
                break;
            case 'error':
                log += ' (error)'.error;
                break;
        }
        console.log(log);

    }

    //$logcommande log les commandes dans la console
    function logcommande(msg) {
        logconsole('Commande ' + msg.content + ' éxécutée', 'info', msg);
    }

    //Function retournant un aléatoire rond
    function random(max) {
        return Math.floor((Math.random() * max) + 1);
    }


    //Catch des erreurs et retour
} catch (err) {
    addlogerreurs(err);
    console.log(err.message);
    return
}
