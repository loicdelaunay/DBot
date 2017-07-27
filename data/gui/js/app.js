// Initialisation des modules
const ipc = require('electron').ipcRenderer; //Module permettant de communiquer avec le programme principal
const remote = require('electron').remote;
const fs = require('fs'); //Module gestion fichiers
const path = require("path");
const jquery = require("jquery");
var dateTime = require('node-datetime'); //api pour la gestion du temps

//Global app
var compteur = 0; //Compteur de message 
// A l'initialisation de l'app
$(document).ready(function () {
    //Initialise les objets materialize
    $('.modal').modal();

    //Affiche les options en fonction du fichier de config
    affichageOptions();
});

// Gestion pour quiiter l'application
document.getElementById('btnQuitter').addEventListener('click', () => {
    ipc.send('quitter');
});

//Gestion des IPC

//Quand une ligne doit etre ajouter a la console
ipc.on('consoleADD', (event, msg) => {

    var destination = path.join(__dirname, 'consoleline.html');

    var dt = dateTime.create();
    var date = dt.format('d-m-Y H:M:S'); //Set la date de la console

    fs.readFile(destination, 'utf-8', function (err, data) {
        if (err) {
            remote.dialog.showErrorBox('Erreur !', "L'application a rencontré une erreur. Erreur pendant l'ajout d'une ligne." + destination);
        } else {
            var consoleline = data.replace("*!msg!*", msg);
            consoleline = consoleline.replace("*!date!*", date);
            consoleline = consoleline.replace("*!numero!*", compteur);

            //Je suis sure qu'il y à une méthode pour transformer ça en objet et le récup avec une sorte de this :S #jesuisc# xD
            document.getElementById('baliseConsole').innerHTML += consoleline;


            compteur += 1;
        }
    });
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

            var optionsJSON = JSON.parse(data);

            //Affichage des options

            document.getElementById('nomserveur').value = optionsJSON.nomserveur;

            document.getElementById('prefix').value = optionsJSON.prefix;

            document.getElementById('token').value = optionsJSON.token;

            document.getElementById('idadmin').value = optionsJSON.idadmin;

            document.getElementById('portserveur').value = optionsJSON.portserveur;

            //Checkbox
            if (optionsJSON.module_worldOfTank) {
                document.getElementById('module_worldOfTank').checked = true;
            } else {
                document.getElementById('module_worldOfTank').checked = false;
            }

            //Checkbox
            if (optionsJSON.module_youtube) {
                document.getElementById('module_youtube').checked = true;
            } else {
                document.getElementById('module_youtube').checked = false;
            }

            //Checkbox
            if (optionsJSON.module_prison) {
                document.getElementById('module_prison').checked = true;
            } else {
                document.getElementById('module_prison').checked = false;
            }

            //Checkbox
            if (optionsJSON.module_musique) {
                document.getElementById('module_musique').checked = true;
            } else {
                document.getElementById('module_musique').checked = false;
            }

            //Checkbox
            if (optionsJSON.module_messageAutoReponse) {
                document.getElementById('module_messageAutoReponse').checked = true;
            } else {
                document.getElementById('module_messageAutoReponse').checked = false;
            }

            //Checkbox
            if (optionsJSON.module_serveurWeb) {
                document.getElementById('module_serveurWeb').checked = true;
            } else {
                document.getElementById('module_serveurWeb').checked = false;
            }

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

            //Checkbox
            if (document.getElementById('module_worldOfTank').checked) {
                optionsJSON.module_worldOfTank = true;
            } else {
                optionsJSON.module_worldOfTank = false;
            }

            if (document.getElementById('module_youtube').checked) {
                optionsJSON.module_youtube = true;
            } else {
                optionsJSON.module_youtube = false;
            }

            if (document.getElementById('module_prison').checked) {
                optionsJSON.module_prison = true;
            } else {
                optionsJSON.module_prison = false;
            }

            if (document.getElementById('module_musique').checked) {
                optionsJSON.module_musique = true;
            } else {
                optionsJSON.module_musique = false;
            }

            if (document.getElementById('module_messageAutoReponse').checked) {
                optionsJSON.module_messageAutoReponse = true;
            } else {
                optionsJSON.module_messageAutoReponse = false;
            }

            if (document.getElementById('module_worldOfTank').checked) {
                optionsJSON.module_serveurWeb = true;
            } else {
                optionsJSON.module_serveurWeb = false;
            }

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
