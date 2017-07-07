// Initialisation des modules
const ipc = require('electron').ipcRenderer; //Module permettant de communiquer avec le programme principal
const remote = require('electron').remote;
const fs = require('fs'); //Module gestion fichiers
const path = require("path");


// A l'initialisation de l'app
$(document).ready(function () {
    $('.modal').modal();
    affichageOptions();
});

// Gestion pour quiiter l'application
document.getElementById('btnQuitter').addEventListener('click', () => {
    ipc.send('quitter');
});

//Gestion des IPC
ipc.on('consoleADD', (event, msg) => {
    alert(msg);
    document.getElementById('console').innerHTML = msg;
});

//Demande de la validation de la sauvegarde les options du fichier de configuration
document.getElementById('btnOptionSauvegarder').addEventListener('click', () => {
    $('#validationOption').modal('open');
});

//Demande de la validation de la sauvegarde les options du fichier de configuration
document.getElementById('validationOptionComfirmer').addEventListener('click', () => {
    updateOptions();
});


// *** GERE LES FONCTIONS *** //

//Affiche les options du dbot_config
function affichageOptions() {

    //Fichier de destination 
    var destination = path.join(__dirname, '../../', 'dbot_config.json');

    //Vérifie si le fichier utilisateur existe 
    fs.readFile(destination, 'utf-8', function (err, data) {

        //Si le fichier n'existe pas 
        if (err) {
            remote.dialog.showErrorBox('Erreur !', "L'application a rencontré une erreur. Erreur pendant la lecture du fichier de configuration.");
        } else {
            alert("Fichier config trouvé");

            var optionsJSON = JSON.parse(data);

            //Affichage des options

            document.getElementById('nomserveur').value = optionsJSON.nomserveur;

            document.getElementById('prefix').value = optionsJSON.prefix;

            document.getElementById('token').value = optionsJSON.token;

            document.getElementById('idadmin').value = optionsJSON.idadmin;

            document.getElementById('portserveur').value = optionsJSON.portserveur;
        }
    });
}

//Met à jour le fichier de config dbot_config
function updateOptions() {
    //Fichier de destination 
    var destination = path.join(__dirname, '../../', 'dbot_config.json');

    //Vérifie si le fichier utilisateur existe 
    fs.readFile(destination, 'utf-8', function (err, data) {

        //Si le fichier n'existe pas 
        if (err) {
            remote.dialog.showErrorBox('Erreur !', "L'application a rencontré une erreur. Erreur pendant la lecture du fichier de configuration.");
        } else {
            alert("Fichier config trouvé");

            var optionsJSON = JSON.parse(data);

            //Affichage des options

            optionsJSON.nomserveur = document.getElementById('nomserveur').value

            optionsJSON.prefix = document.getElementById('prefix').value;

            optionsJSON.token = document.getElementById('token').value;

            optionsJSON.idadmin = document.getElementById('idadmin').value;

            optionsJSON.portserveur = document.getElementById('portserveur').value;

            //Réécrit le fichier JSON
            fs.writeFile(destination, JSON.stringify(optionsJSON), 'utf-8', function (err) {
                if (err) {
                    remote.dialog.showErrorBox('Erreur !', "L'application a rencontré une erreur. Erreur pendant l'écriture du nouveau fichier configuration.");
                }
                document.getElementById('optionModifie').innerHTML = "Fichier de config modifié merci de relancer l'application";
                Materialize.toast('Fichier de configuration modifié !', 4000);
            })
        }
    });
}
