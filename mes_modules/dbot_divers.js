//** DBOT WOT : Api pour la gestion des données du jeu WorldOfTanks dans le DBOT**//


// Importation des APIs

//Function retournant un aléatoire rond
exports.random = function (max) {
    return Math.floor((Math.random() * max) + 1);
}

//Depuis combien de temps le bot est en ligne 
exports.online = function (msg) {
    // TODO A FAIRE
}

//Redemarre le BOT
exports.restart = function (msg) {
    const spawn = child_process.spawn;
    const bat = spawn('cmd.exe', ['/c', 'startbot.bat']);

    msg.reply('Restart en cours ....')

    bat.stdout.on('data', (data) => {
        console.log(data.toString());
    });

    bat.stderr.on('data', (data) => {
        console.log(data.toString());
    });

    bat.on('exit', (code) => {
        console.log(`Child exited with code ${code}`);
    });

    msg.reply("Restart Okay, fermeture de l 'ancienne méthode, merci de patienter 3 secondes")
}

//Arrete le bot
exports.exit = function () {
    process.exit(-1);
}
