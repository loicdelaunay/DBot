//** DBOT GUI : Api pour la gestion de l'affichage du DBOT**//

// Importation des modules electronJS
const electron = require('electron'); // Importation du framework electron
const app = electron.app; // Raccourcie pour accèder au framework electron
const BrowserWindow = electron.BrowserWindow; // Raccourcie pour accéder au gestion des fenètres de electron
const ipc = electron.ipcMain;

// Importation des modules 
const path = require("path");
const fs = require("fs");

//**    Gestion affichage de la fenetre d'accueil   **//

let mainWindow;

function createWindow() {

    mainWindow = new BrowserWindow({
        width: 1280,
        height: 1020,
        title: 'DBOT',
        movable: true,
        maximized: false,
        center: true,
        frame: false
    });

    mainWindow.loadURL(path.join(__dirname, '../data/gui', 'app.html'));

    mainWindow.on('closed', () => {
        mainWindow = null;
    })
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});


//* GESTION IPC *//

//Quand l'ipc reçoit une erreur
ipc.on('log-error', (event, arg) => {
    console.log("Erreur : " + arg + " ! Veuillez rapporter ce bug au développeur de l'application.");
    event.sender.send('error-logged');
});

//Quand l'ipc reçoit l'information de quitter
ipc.on('quitter', () => {
    app.quit();
});


//**    FIN Gestion affichage de la fenetre d'accueil   **//

exports.consoleADD = function (msg) {
    mainWindow.webContents.send('consoleADD', msg);
};
