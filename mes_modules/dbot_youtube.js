//** DBOT YOUTUBE : Api pour la gestion de Youtube**//

// Importation des APIs
const YoutubeMp3Downloader = require('youtube-mp3-downloader'); //api pour télécharger des MP3 depuis Youtube
const getYouTubeID = require('get-youtube-id');

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_divers = require('../mes_modules/dbot_divers.js'); // Importation de mon module Divers

// Dossier executable ffmpeg 
var ffmpegPath = dbot_divers.dossierFfmpeg()

//Initialisation de l'api youtubeMp3Downloader
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": ffmpegPath, // Localisation de l'executable de ffmpeg 
    "outputPath": "./data/musiques", // Localisation du dossier de stockage des musiques
    "youtubeVideoQuality": "highest", // Qualité des vidéos enregistrés
    "queueParallelism": 2, // Combien de téléchargement parallèle il va effectuer
    "progressTimeout": 4000 // Combient de temps se déroule entres chaque intervalles d'affichge de progression
});

//gestion de l'api de YOutubeMp3
YD.on("finished", function (data) {
    dbot_console.addlogmessage("Le téléchargement de l'import Youtube est terminé", 'green');
});

YD.on("error", function (error) {
    dbot_console.addlogmessage(error, 'error');
});

YD.on("progress", function (progress) {
    dbot_console.addlogmessage("Téléchargement en cours de l'import Youtube ...", 'info');
});

exports.commande = function (msg, args, commande) {
    //*youtubeimportid args[0] = id de la vidéo args[1] = nom de l'enregistrement
    if (commande[0] == 'youtubeimportid' && msg.author.id == admin) {
        dbot_console.printConsoleCommande(msg);

        YD.download(idvideo, nomenregistrememnt);
        msg.reply('Importation de la vidéo youtube avec id : ' + idvideo + ' sous le nom de : ' + nomenregistrememnt);
    }

    //*youtubeimporturl args[0] = url de la vidéo args[1] = nom de l'enregistrement
    else if (commande[0] == 'youtubeimporturl' && msg.author.id == admin) {
        dbot_console.printConsoleCommande(msg);

        var id = getYouTubeID(urlvideo); //Transforme l'url de la vidéo YT en ID YT
        YD.download(id, nomenregistrememnt);
        msg.reply("Importation de la vidéo youtube avec l'url : " + urlvideo + ' sous le nom de : ' + nomenregistrememnt);
    }

}
