//***** D BOT *****//

// Importation des APIs
const Discord = require('discord.js'); // api de discord
const fs = require('fs'); //api nodejs pour gestion des fichiers
const dateTime = require('node-datetime'); //api pour la gestion du temps
const child_process = require('child_process'); //api pour gérer les processus
const YoutubeMp3Downloader = require('youtube-mp3-downloader'); //api pour télécharger des mp3 depuis youtube
const getYouTubeID = require('get-youtube-id');
const colors = require('colors'); // api pour gérer la couleur dans la console 

//Chargement du fichier de configuration du D-BOT
const config = require('./dbot_config.json');

//Version du D-BOT
var version = 0.1;

//Chargement du fichier de tournoi
var tournoi = require('./data/tournoi/tournoi.json');

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
console.log('\n********************** LANCEMENT DU D-BOT ' + version + ' ... ***********************\n\n.');

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
console.log('\n\n********************** CHARGEMENT DU FICHIER DE CONFIGURATION *******************\n\n');

//Connection
client.login(token);

// A la conncetion du bot
client.on('ready', () => {
    var dt = dateTime.create();
    var heurestart = dt.format('d-m-Y H:M:S');
    client.user.setStatus("online");
    client.user.setGame("/aide pour obtenir de l'aide");
    logconsole('Le D-BOT est fonctionnel ! ' + heurestart, 'error');
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
        }
        if (msg.content === 'AH!') {
            msg.reply('https://i.ytimg.com/vi/HdZ5OD1KMGs/hqdefault.jpg');
            console.log('Blague : AH! effectué !');
        }
        if (derniermot(msg.content) === 'quoi' ||
            derniermot(msg.content) === 'quoi?') {
            msg.reply('feur');
        }
        if (derniermot(msg.content) === 'comment') {
            msg.reply('dant coustaud');
        }
        if (msg.content === 'hein') {
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

        //*aide affiche l'aide disponible
        if (commande[0] == 'aide' || commande[0] == '?') {
            logconsole('Affichage de l aide', info, msg);
            logconsole('Affichage de l aide', info);
            msg.reply("Voici l'aide :" +
                "\n - pour parler avec l 'ia du bot taper * avant votre message" +
                "\n - /aideg pour obtenir l'aide générale" +
                "\n - /aidewot pour obtenir l'aide à propos des commandes World Of Tanks");

            if (msg.author.id == admin) {
                msg.reply("Avec votre rôle vous avez accès aux commandes suivantes :" +
                    "\n - /aideadmin pour obtenir l'aide admin" +
                    "\n - /aidemusique pour obtenir l'aide sur la gestrion des musiques" +
                    "\n - /aidetournoi pour obtenir l'aide sur la gestion des tournois")
            }
        }

        //*aideadmin affiche l'aide pour les admins
        if (commande[0] == 'aideadmin' && msg.author.id == admin) {
            logconsole('Affichage de l aide admin', info);
            msg.reply('Salut voici la liste de mes commandes admin :' +
                '\n - /block "nom du client     pour bloquer un utilisateur. ' +
                '\n - /unblock "nom du client" pour débloquer un utilisateur. ' +
                '\n - /restart     pour restart le bot' +
                '\n - /say    fait parler le bot dans un channel' +
                '\n - /close     pour fermer le bot.');
        }

        //*aidemusique affiche l'aide pour la gestion de la musique
        if (commande[0] == 'aidemusique' && msg.author.id == admin) {
            logconsole('Affichage de l aide musique', info);
            msg.reply('Salut voici la liste de mes commandes admin :' +
                '\n - /musiqueimportytid "id de la musique" "nom du fichier importé"    pour importé une musique depuis youtube avec son id ' +
                '\n - /musiqueimportyturl "url de la musique" "nom du fichier importé"    pour importé une musique depuis youtube avec son url ' +
                '\n - /musiqueplay "nomdelamusique"    pour lire une musique dans le salon ' +
                '\n - /musiquesplaybyurl "url"     pour lire de la musique depuis une url ' +
                '\n - /musiquestop     pour stopper la musique ' +
                '\n - /musiquelist     retourne une liste de musique '
            )
        }

        //*aideg affiche l'aide global
        if (commande[0] == 'aideg') {
            console.log('Affichage de l aide général');
            msg.reply('Salut voici la liste de mes commandes générales :' +
                '\n - /myavatar    pour avoir un lien vers votre avatar ' +
                '\n - /ping     pour obtenir votre ping. ' +
                '\n - /monid     pour obtenir votre id. ' +
                '\n - /datecreation pour obtenir la date de création de votre compte discord.' +
                '\n - /wotinfo *nomdujoueur*    pour obtenir les stats wot du joueur recherché sur les sites les plus réputés. ' +
                '\n - /info     pour obtenir les informations concernant le D-BOT.' +
                '\n - /roll pour jetter un dè à 6 faces.');
        }

        //*aidewot affiche l'aide pour les commandes sur le jeu world of tanks
        if (commande[0] == 'aidewot') {
            console.log('Affichage de l aide wot');
            msg.reply('Salut voici la liste de mes commandes WorldOfTanks :\n - /wotinfo "nomdujoueur"    pour obtenir les stats wot du joueur recherché sur les sites les plus réputés.');
        }

        //*wotinfo Affiche les commandes d'aide a wot
        if (commande[0] == 'wotinfo') {
            console.log('Commande wotinfo éxécuté');
            msg.reply('Voici les statistiques wot du joueur : ' + args[0] + '\nPar world of tanks : https://worldoftanks.eu/fr/community/accounts/#wot&at_search=' + args[0] + '\n' + 'Par WOT-LIFE : https://fr.wot-life.com/eu/player/' + args[0] + '\n' + 'Par WOT STAT : http://www.wotstats.org/stats/eu/' + args[0] + '\n' + 'Par NoobMeter : http://www.noobmeter.com/player/eu/' + args[0]);
        }

        //*info donne les infos du boy
        if (commande[0] == 'info') {
            msg.reply('Le D-BOT est un bot discord basée sur DISCORD.JS développé par Dream il a pour but d etre un vrai couteau suisse !' +
                '\nVersion de Discord.JS utilisé : ' + Discord.version + '\nVersion de Node utilisé : ' + process.version);
        }

        //*spam Commande de test, permet de spammer un chat
        if (commande[0] == 'spam' && msg.author.id === admin) {
            msg.reply('D-BOT MOD SPAM');
            for (var i = 0; i < args[0]; i++) {
                msg.reply('D-BOT MOD SPAM');
            }
        }

        //*roll jette des dès compris entre 1 et 6
        if (commande[0] == 'roll') {
            msg.reply('Le dé est sur la face : ' + random(6));
        }

        //*monid affiche l'id de l'utilisateur
        if (commande[0] == 'monid') {
            msg.reply('Votre ID : ' + msg.author.id);
        }


        //*register enregistre l'utilisateur dans la BDD local
        if (commande[0] == 'register') {
            msg.reply('Tu a bien été enregistré comme membre sur le D-BOT : ' + msg.author.username);
            var info = msg.author.id + ', 0, 0';
            var file = fs.writeFile('./data/' + msg.author.id + '.txt', JSON.stringify(info), function (err) {
                if (err) {
                    console.log('Erreur :( ' + err);
                }
            });
        }

        //*mesinfos renseigne les information du joueur par rapport a la BDD du serveur
        if (commande[0] == 'mesinfos') {
            var infos = information(msg.author.id);
            msg.reply('\Ton ID : ' + infos[0] + '\Ton sel : ' + infos[1] + '\Ton niveau : ' + infos[2]);
        }

        //*ping donne le ping du joueur
        if (commande[0] == 'ping') {
            msg.reply("Ton ping est de : " + msg.author.client.ping + "ms");
        }

        //*close arrete le bot
        if (commande[0] == 'close' && msg.author.id == admin) {
            msg.reply('Fermeture en cours ...')
            setTimeout(exitvalidation(msg), 2000);
        }

        //*restart relance le bot
        if (commande[0] == 'restart' && msg.author.id == admin) {
            msg.reply('Restart en cours ....')
            restart();
            msg.reply("Restart Okay, fermeture de l 'ancienne méthode, merci de patienter 3 secondes")
            setTimeout(exit, 3000);
        }

        //*online affiche le temps depuis lequel le bot est en ligne
        if (commande[0] == 'online') {
            msg.reply("Je suis en ligne depuis : " + heurestart);
        }

        //*myavatar affiche l'image de l'avatar du joueur
        if (commande[0] == 'myavatar') {
            msg.reply('Voici le lien vers votre avatar : ' + msg.author.avatarURL);
        }

        //*datecreation affiche la date de création du client
        if (commande[0] == 'datecreation') {
            msg.reply('Votre compte a ete cree le : ' + msg.author.createdAt);
        }

        //*tournoiinit initialise à zéro le tournoi
        if (commande[0] == 'tournoiinit' && msg.author.id == admin) {
            msg.reply('Le tournoi à bien été initialisé');
        }

        //*tournoiadd args[0] = nom du joueur ajoute un joueur à la liste des participant du tournoi
        if (commande[0] == 'tournoiadd' && msg.author.id == admin) {
            msg.reply('Le joueur : ' + args[0] + 'a bien été rajouté au tournoi');
        }

        //*tournoistart
        if (commande[0] == 'tournoistart' && msg.author.id == admin) {
            var listedesjoueurs = tournoi.participants;
            var affichelistedesjoueurs = "";
            listedesjoueurs.forEach(function (joueur) {
                affichelistedesjoueurs += joueur + "\n";
            })
            var listedesmatchs = ""
            var compteur = 0;
            while (listedesjoueurs.length > 1) {
                compteur++;
                var joueurselectionne = random(listedesjoueurs.length - 2);
                var equipe1 = listedesjoueurs[joueurselectionne];
                listedesjoueurs.splice(joueurselectionne, 1);
                var joueurselectionne = random(listedesjoueurs.length - 2);
                var equipe2 = listedesjoueurs[joueurselectionne];
                listedesjoueurs.splice(joueurselectionne, 1);
                //gestion de l'affichage
                listedesmatchs += ('```css\n ⚔ n°' + compteur + ' le joueur : #' + equipe1 + " va affronter : #" + equipe2 + "```")
            }
            msg.channel.send('🔱🔱🔱 ' + tournoi.nomtournoi + ' 🔱🔱🔱' + '\n\n\nVoici la liste des matchs: \n');
            msg.channel.send(listedesmatchs);

        }

        //*musiqueimportytid args[0] = id de la vidéo args[1] = nom de l'enregistrement
        if (commande[0] == 'musiqueimportytid' && msg.author.id == admin) {
            YD.download(args[0], args[1]);
            msg.reply('Importation de la vidéo youtube avec id : ' + args[0] + ' sous le nom de : ' + args[1]);
        }

        //*musiqueimportyturl args[0] = url de la vidéo args[1] = nom de l'enregistrement
        if (commande[0] == 'musiqueimportyturl' && msg.author.id == admin) {
            var id = getYouTubeID(args[0]);
            YD.download(id, args[1]);
            msg.reply('Importation de la vidéo youtube avec id : ' + args[0] + ' sous le nom de : ' + args[1]);
        }

        //*musiquelist Retourne une liste de toutes les musiques
        if (commande[0] == 'musiquelist') {
            var listedesmusiques = "";
            fs.readdirSync("./musique").forEach(file => {
                listedesmusiques += file + "\n";
            })
            msg.reply("****** LISTE DES MUSIQUES ******* \n\n" + listedesmusiques);
        }

        //*musiquestop stop la musique en cours (UTILISE UN HACK SON)
        if (commande[0] == 'musiquestop' && msg.author.id == admin) {
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
        if (commande[0] == 'musiqueplay' && msg.author.id == admin) {
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
        if (commande[0] == 'musicplaybyurl') {
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
        if (commande[0] == 'block') {
            msg.reply('Le rageux : ' + args[0] + ' a bien ete bloque');
        }

        //*unblock args[0] sort de prison un client args[0] = client
        if (commande[0] == 'unblock') {
            msg.reply('Le rageux : ' + args[0] + ' a bien ete debloque');
        }
    });

    // Message de bienvenue
    client.on('guildMemberAdd', member => {
        member.guild.defaultChannel.send(`Bienvenue, ${member}! ,sur le serveur Discord du clan DreamOfTheYear !`);
        const channel = member.guild.channels.find('chatglobal', 'member-log');
        if (!channel) return;
        channel.send('Bienvenue :, ' + member);
    });

    //gestion de l'api de YOutubeMp3
    YD.on("finished", function (data) {
        console.log(data);
    });

    YD.on("error", function (error) {
        console.log(error);
    });

    YD.on("progress", function (progress) {
        console.log(progress);
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


    //Gestion des messages de log avec couleur et formatage
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


    function random(max) {
        return Math.floor((Math.random() * max) + 1);
    }

    function affichematch(msg, equipe1, equipe2) {
        msg.reply("```le joueur : " + equipe1 + "va affronter : " + equipe2 + "```");
    }



} catch (err) {
    restart();
    addlogerreurs(err);
    console.log(err.message);
    return
}
