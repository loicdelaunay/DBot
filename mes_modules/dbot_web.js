//** DBOT WEB : Api pour la gestion des données avec une interface web dans le DBOT**//

// Importation des APIs
const http = require('http');
const express = require('express');
const path = require('path');
const Discord = require('discord.js'); // api de Discord 

// Importation de mes modules
const dbot_divers = require('../mes_modules/dbot_divers.js');
const dbot_youtube = require('../mes_modules/dbot_youtube.js');

// Chargement du fichier de configuration du D-BOT
const config = require(dbot_divers.dossierRoot() + '/dbot_config.json');

//Initialisation du module web avec express.js
var app = express();

//Set du folder des pages webs
app.set('views', path.join(dbot_divers.dossierRoot(), '/data/pageWeb'));

//Set du folder data utilisé par Express
app.use(express.static(dbot_divers.dossierRoot() + '/data/pageWeb'));


//-*-*-*-*- GESTION DES PAGES WEBS -*-*-*-*-*-

app.get('/', function (req, res) {
    res.render('Accueil.ejs', {
        versiondbot: dbot_divers.version(),
        versionodejs: process.version,
        versiondiscordjs: Discord.version,
        cheminffmpegpath: exports.dossierFfmpeg()
    });
});

//-*-*-*-*- FIN GESTION DES PAGES WEBS -*-*-*-*-*-

//Catch les pages inconnu
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

//Ecoute du serveur
app.listen(config.portserveur);
