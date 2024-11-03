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
        console.error('Erreur de connexion à la base de données:', err)
    }else{
        console.log('Connexion réusssi à la base de données Mysql hostinger')
    }
})

module.exports = db;