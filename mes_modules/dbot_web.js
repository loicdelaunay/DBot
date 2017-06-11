//** DBOT WEB : Api pour la gestion des données avec une interface web dans le DBOT**//

// Importation des APIs
const http = require('http');
const express = require('express');
const path = require('path');

// Importation de mes modules
const dbot_divers = require('../mes_modules/dbot_divers.js'); // Importation de mon module Divers

//Initialisation du module web avec express.js
var app = express();

//Set du folder des pages webs
app.set('views', path.join(dbot_divers.dossierRoot(), '/data/pageWeb'));

//Set du folder data utilisé par Express
app.use(express.static(dbot_divers.dossierRoot() + '/data/pageWeb'));


//-*-*-*-*- GESTION DES PAGES WEBS -*-*-*-*-*-

app.get('/', function (req, res) {
    res.render('Accueil.ejs', {
        versiondbot: dbot_divers.version()
    });
});

//-*-*-*-*- FIN GESTION DES PAGES WEBS -*-*-*-*-*-

//Catch les pages inconnu
app.use(function (req, res, next) {
    res.setHeader('Content-Type', 'text/plain');
    res.send(404, 'Page introuvable !');
});

//Ecoute du serveur
app.listen(8080);
