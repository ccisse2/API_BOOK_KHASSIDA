const mysql = require('mysql2');
require('dotenv').config();

const  db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
})

db.connect(err => {
    if (err) {
    }else{
    }
})

module.exports = db;



db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connexion à la base de données réussie');

        // Exécuter une simple requête pour vérifier la connexion
        db.query('SELECT 1', (err, results) => {
            if (err) {
                console.error('Erreur lors de l\'exécution de la requête :', err);
            } else {
                console.log('Résultat de la requête :', results);
            }

            // Fermer la connexion après le test
            db.end();
        });
    }
});
