//** DBOT WOT TOURNOI : Api pour la gestion des données des tournois sur le jeu WorldOfTanks dans le DBOT**//



// Importation des APIs
const Discord = require('discord.js'); // api de discord

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console
const dbot_permission = require('../mes_modules/dbot_permission.js'); // Importation de mon module Console

//Chargement du fichier de tournoi
const tournoi = require('../data/wotTournoi/tournoi.json');
const tournoiparticipant = tournoi.participants;

exports.commande = function (msg, args, commande) {

    //*wottournoiaide ou *wotta -> Affiche l'aide concernant les tournois worldoftanks
    if (commande[0] == 'wottournoiaide' || commande[0] == "wotta") {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("   ❓   AIDE TOURNOI WOT:   ❓   ")
            .setColor(0x00AE86)
            .setDescription('Ici vous trouverez toutes les commandes concernant les tournois de la DOTY')
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

            .addField('/wottournoirule', "pour obtenir les règle en vigueur concernant le tournoi.")
            .addField('/wottournoistart', "pour obtenir les règle en vigueur concernant le tournoi.")

        msg.channel.send({
            embed
        });
    }

    //*wottournoirule -> Affiche les règles du tournoi
    else if (commande[0] == 'wottournoirule') {
        dbot_console.printConsoleCommande(msg);

        const embed = new Discord.RichEmbed()
            .setTitle("     🏆   VOICI L'ORGANISATION DES TOURNOIS INTRA DOTY !      🏆   ")
            .setColor(0x00AE86)
            .setDescription('Ici vous trouverez toutes les règles/informations concernant les tournois de la DOTY')
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()
            .setThumbnail('http://www.loicdelaunay.fr/projets/dbot/tournoilogo.png')

            .addField('Information 1:', '- Les matchs sont organisés automatiquement par le script du D-BOT.')

            .addField('Information 2:', '- La map sélectionnée sera aussi choisie parmi une liste dans le script du D-BOT ( cette liste sera fournie pendant la création du tournoi ).')

            .addField('Information 3:', "- Le match sera composé des deux équipes et d'un arbitre + un contre arbitre si possible.")

            .addField('Information 4:', '- Les arbitres sont les joueurs haut gradés du clan DOTY de même pour les contres arbitres.')

            .addField('Information 5:', "- Le contre-arbitre veillera au bon déroulement des matchs et fera part de toute remarque à l'organisateur du tournoi.")

            .addField('Information 6:', "- Chaque match s'organise en 3 rounds ! Défaite du match = élimination du tournoi.")

            .addField('Information 7:', '- Des informations complémentaires seront données à la création du tournoi.')

            .addField('Information 8:', '- Les heures du tournoi seront données à sa création, une absence amènera à une disqualification immédiate.')

            .addField('Déroulement:', "- L'arbitre créera une salle d'entraînement, invitera les joueurs et mettra la map choisie par le D-BOT par la suite, chaque équipe enverra en MESSAGE PRIVEE à l'arbitre le tank choisi sans l'avoir sélectionné, quand les deux équipes ont fini de choisirleurs tanks ils pourront se mettre prêt et ne pourront plus changer de tank, l'arbitre vérifiera que celui-ci correspond bien au tank cité précédemment.")

        msg.channel.send({
            embed
        });
    }

    //*tournoistart -> Lance le tournoi
    else if (commande[0] == 'wottournoistart' && dbot_permission.isadmin(msg.author.id)) {
        dbot_console.printConsoleCommande(msg);

        var listedesmatchs = ""
        var compteur = 0;
        var listedesjoueurs = tournoiparticipant;

        var embed = new Discord.RichEmbed()
        embed.addField('\u200B', '\u200B')

        while (listedesjoueurs.length > 1) {
            compteur++;
            var joueurselectionne = random(listedesjoueurs.length - 2);
            var equipe1 = listedesjoueurs[joueurselectionne];
            listedesjoueurs.splice(joueurselectionne, 1);
            var joueurselectionne = random(listedesjoueurs.length - 2);
            var equipe2 = listedesjoueurs[joueurselectionne];
            listedesjoueurs.splice(joueurselectionne, 1);
            var mapselectionnee = random(listemaps.length)

            //gestion de l'affichage
            embed.addField('⚔ Match N°' + compteur, 'le joueur : #' + equipe1 + " va affronter : #" + equipe2 + ' sur la map : ' + '[' + listemaps[mapselectionnee] + ']' + '(' + listemapsurl[mapselectionnee] + ')');
        }

        embed
            .setTitle("   🔱   " + tournoi.nomtournoi + "   🔱   ")
            .setColor(0xafaf26)
            .setDescription('Voici la liste des matchs:')
            .setFooter('© D-BOT copyright Dream')
            .setTimestamp()

        embed.addField('\u200B', '\u200B')

        msg.channel.send({
            embed
        });

    }
}
