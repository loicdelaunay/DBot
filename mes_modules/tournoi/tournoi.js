      // module tournoi

      //Importation des APIs
      const appRoot = require('app-root-path');

      //Importation de mes APIs
      const mesOutils = require(appRoot + '/mes_modules/mesOutils/mesOutils.js');

      //importation du fichier de configuration du tournoi
      var tournoi = require('./tournoi.json');


      //Permet de lancer le tournoi
      exports.listedesmatchs = function () {
          var listedesjoueurs = tournoi.participants;
          var affichelistedesjoueurs = "";
          listedesjoueurs.forEach(function (joueur) {
              affichelistedesjoueurs += joueur + "\n";
          })
          var listedesmatch = ""
          var compteur = 0;
          while (listedesjoueurs.length > 1) {
              compteur++;
              var joueurselectionne = mesOutils.random(listedesjoueurs.length - 2);
              var equipe1 = listedesjoueurs[joueurselectionne];
              listedesjoueurs.splice(joueurselectionne, 1);
              var joueurselectionne = mesOutils.random(listedesjoueurs.length - 2);
              var equipe2 = listedesjoueurs[joueurselectionne];
              listedesjoueurs.splice(joueurselectionne, 1);
              //gestion de l'affichage
              listedesmatch += ('```css\n ⚔ n°' + compteur + ' le joueur : #' + equipe1 + " va affronter : #" + equipe2 + "```")
          }
          return listedesmatch;
      }

      exports.nomdutournoi = function () {
          return tournoi.nomdutournoi
      }
