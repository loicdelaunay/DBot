// Initialisation des modules
const ipc = require('electron').ipcRenderer; //Module permettant de communiquer avec le programme principal
const remote = require('electron').remote;
const fs = require('fs'); //Module gestion fichiers

document.getElementById('btnQuitter').addEventListener('click', () => {
    ipc.send('quitter');
});
