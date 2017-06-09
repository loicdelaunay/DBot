//***** D BOT *****//

//CTRL + F *nomdelacommande pour rechercher les commandes dans le projet 

// Importation des APIs
const Discord = require('discord.js'); // api de discord
const fs = require('fs'); //api nodejs pour gestion des fichiers
const dateTime = require('node-datetime'); //api pour la gestion du temps
const child_process = require('child_process'); //api pour gérer les processus
const YoutubeMp3Downloader = require('youtube-mp3-downloader'); //api pour télécharger des MP3 depuis Youtube
const getYouTubeID = require('get-youtube-id');
const colors = require('colors'); // api pour gérer la couleur dans la console 

// Importation de mes modules
const dbot_divers = require('./mes_modules/dbot_divers.js'); // Importation de mon module World of tanks
const dbot_wot = require('./mes_modules/dbot_wot.js'); // Importation de mon module World of tanks
const dbot_wotTournoi = require('./mes_modules/dbot_wotTournoi.js'); // Importation de mon module World of tanks

//Chargement du fichier de configuration du D-BOT
const config = require('./dbot_config.json');

//Version du D-BOT
var version = "0.9a";

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

    // Quand le bot reçoit un message
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

        //découpe le message en argument par chaque espaces 
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
                    .addField('/roll "nombre de dés" "nombre de face du dé"', "pour jeter X dès à X faces.")
                    .addField('/info', "pour obtenir les informations concernant le D-BOT.")

                embed.addField('\u200B', '\u200B')

                msg.channel.send({
                    embed
                });
            }

            //*aidewot affiche l'aide pour les commandes sur le jeu world of tanks
            else if (commande[0] == 'aidewot') {
                logcommande(msg);

                dbot_wot.aide(msg);
            }

            //*wotstats "nomdujoueur" ou *wots "nomdujoueur" pour avoir les stats du joueur
            else if (commande[0] == 'wotstat' || commande[0] == 'wots') {
                logcommande(msg);

                dbot_wot.wotstats(msg, args[0]);
            }

            //*wottank "nomdutank?" ou *wott "nomdutank?" pour avoir les information d'un tank
            else if (commande[0] == 'wottank' || commande[0] == 'wott') {
                logcommande(msg);

                dbot_wot.wottank(msg, args[0]);

            }

            //*wotinfo "nomdujoueur" ou *woti "nomdujoueur" pour avoir les information du joueur selon WorldOfTnkas
            else if (commande[0] == 'wotinfo' || commande[0] == 'woti') {
                logcommande(msg);

                dbot_wot.wotinfo(msg, args[0]);
            }


            //*wotrecherche "nomdujoueur" ou *wotr "nomdujoueur"  permet de lancer une recherche sur un joueur
            else if (commande[0] == 'wotrecherche' || commande[0] == 'wotr') {
                logcommande(msg);

                dbot_wot.wotrecherche(msg, args[0]);
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

                dbot_divers.restart(msg);
            }

            //*online affiche le temps depuis lequel le bot est en ligne
            else if (commande[0] == 'online') {
                logcommande(msg);

                dbot_divers.online(msg);
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

            // *-*-*- DEBUT WOTTOURNOI *-*-*- //

            //*wottournoiaide ou *wotta affiche l'aide pour les commandes sur le jeu world of tanks
            else if (commande[0] == 'wottournoiaide' || commande[0] == "wotta") {
                logcommande(msg);

                dbot_wotTournoi.info(msg);
            }

            //*wottournoirule = nom du joueur ajoute un joueur à la liste des participant du tournoi
            else if (commande[0] == 'wottournoirule') {
                logcommande(msg);

                dbot_wotTournoi.rule(msg);
            }

            //*tournoistart
            else if (commande[0] == 'wottournoistart' && msg.author.id == admin) {
                logcommande(msg);

                dbot_wotTournoi.start(msg);

            }

            // *-*-*- FIN WOTTOURNOI *-*-*- //

            // *-*-*- DEBUT MUSIQUE *-*-*- //

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

            // *-*-*- FIN MUSIQUE *-*-*- //

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

    //Vérifie que le client est un admin
    function isadmin(client) {
        if (client == admin) {
            return true;
        } else {
            return false;
        }
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

    //Catch des erreurs et retour
} catch (err) {
    addlogerreurs(err);
    console.log(err.message);
    return
}
