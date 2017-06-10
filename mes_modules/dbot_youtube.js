//** DBOT YOUTUBE : Api pour la gestion de Youtube**//

// Importation des APIs
const path = require('path'); // api de gestion des chemins d'accès
const YoutubeMp3Downloader = require('youtube-mp3-downloader'); //api pour télécharger des MP3 depuis Youtube
const getYouTubeID = require('get-youtube-id');

// Dossier de lancement du bot
var appDir = path.dirname(require.main.filename);

// Dossier executable ffmpeg 
var ffmpegPath = appDir + '/prerequis/ffmpeg/bin/ffmpeg.exe'

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

exports.ffmpegpath = function () {
    return ffmpegPath
}

exports.importytid = function (msg, idvideo, nomenregistrememnt) {
    YD.download(idvideo, nomenregistrememnt);
    msg.reply('Importation de la vidéo youtube avec id : ' + idvideo + ' sous le nom de : ' + nomenregistrememnt);
}

exports.importyturl = function (msg, urlvideo, nomenregistrememnt) {
    var id = getYouTubeID(urlvideo); //Transforme l'url de la vidéo YT en ID YT
    YD.download(id, nomenregistrememnt);
    msg.reply("Importation de la vidéo youtube avec l'url : " + urlvideo + ' sous le nom de : ' + nomenregistrememnt);
}
