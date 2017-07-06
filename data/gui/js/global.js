// Initialisation des modules
const ipc = require('electron').ipcRenderer; //Module permettant de communiquer avec le programme principal
const remote = require('electron').remote;
const fs = require('fs'); //Module gestion fichiers

document.getElementById('btnQuitter').addEventListener('click', () => {
    remote.dialog.showErrorBox('Erreur !', 'L\'application a rencontré une erreur. Votre ordinateur va s\'auto-détruire dans 10 secondes.');
    ipc.send('quitter');
});

ipc.on('consoleADD', (event, msg) => {
    alert(msg);
    document.getElementById('console').innerHTML = msg;
});
