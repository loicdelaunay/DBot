//** DBOT YOUTUBE : Api pour la gestion de Youtube**//

// Importation des APIs
const YoutubeMp3Downloader = require('youtube-mp3-downloader'); //api pour télécharger des MP3 depuis Youtube
const getYouTubeID = require('get-youtube-id');

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_divers = require('../mes_modules/dbot_divers.js'); // Importation de mon module Divers

// Dossier executable ffmpeg 
var ffmpegPath = dbot_divers.dossierRoot() + '/prerequis/ffmpeg/bin/ffmpeg.exe'

//Initialisation de l'api youtubeMp3Downloader
var YD = new YoutubeMp3Downloader({
    "ffmpegPath": ffmpegPath, // Localisation de l'executable de ffmpeg 
    "outputPath": "./musique", // Where should the downloaded and encoded files be stored? 
    "youtubeVideoQuality": "highest", // What video quality should be used? 
    "queueParallelism": 2, // How many parallel downloads/encodes should be started? 
    "progressTimeout": 4000 // Combient de temps se déroule entres chaque intervalles d'affichge de progression
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

//Chemin d'accès de ffmpeg
exports.ffmpegpath = function () {
    return ffmpegPath;
}
