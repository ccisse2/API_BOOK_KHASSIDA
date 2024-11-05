const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,      // Attend que les connexions soient disponibles
    connectionLimit: 30,           // Limite du nombre de connexions simultanées (ajustez selon vos besoins)
    queueLimit: 0                  // Pas de limite pour la file d'attente
});

// Vérifier la connexion initiale au démarrage
db.getConnection((err, connection) => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
    } else {
        console.log('Connexion à la base de données réussie');
        connection.release(); // Relâche la connexion après le test
    }
});

module.exports = db;




