//** DBOT WOT : Api pour la gestion des infos dans la bdd mongo du DBOT **//

// Importation des APIs
var MongoClient = require('mongodb').MongoClient;

// Importation de mes modules
const dbot_console = require('../mes_modules/dbot_console.js'); // Importation de mon module Console

// Set l'url de la BDD
var url = "mongodb://127.0.0.1:27017/dbot";


exports.updateUtilisateur = function (idUtilisateur, msg) {
    console.log("update utilisateur")

    MongoClient.connect(url, function (err, db) {
        if (err) {
            throw err;
        }

        var recherche = {
            idUtilisateur: idUtilisateur
        };

        var valeurs = {
            idUtilisateur: idUtilisateur,
            dernierMessage: msg.content,
            dateDernierMessage: Date.now
        };

        console.log(valeurs);

        db.collection("utilisateurs").find(recherche).toArray(function (err, result) {
            if (err) {
                dbot_console.addlogerreur("Erreur pendant l'update de l'utilisateur")
            } else {
                if (result == "") {

                    console.log("introuvable");

                    db.collection("utilisateurs").insert(recherche, valeurs, function (err, res) {
                        if (err) {
                            throw err;
                        }

                        db.close();
                    });

                } else {

                    console.log("trouvé");

                    db.collection("customers").updateOne(recherche, valeurs, function (err, res) {
                        if (err) {
                            throw err;
                        }

                        db.close();
                    });
                }
            }

        })
    });

}
