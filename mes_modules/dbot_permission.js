//** DBOT WOT : Api pour la gestion des modules divers du DBOT**//


// Importation des APIs

// Fichier de configuration du D-BOT
const config = require('../dbot_config.json');

// Identifiant Discord de l'admin
const admin = config.idadmin;

// Vérifie que le client est un admin
exports.isadmin = function (idclient) {
    if (idclient == admin) {
        return true;
    } else {
        return false;
    }
}

// Id de l'admin
exports.idadmin = function () {
    return admin;
}
