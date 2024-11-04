const bcrypt = require('bcrypt');
const db = require('../db');// Votre fichier de connexion à la base de données



// Exemple d'appel
//addUser('cheikh', 'admin24@ysbs11()').then(r => {


// Le mot de passe que vous souhaitez hacher
const motDePasse = 'admin24@ysbs11()';
const useMotdPasse = '$2b$10$A9KdwF7DOHvQE/AQJgs7NOJbftcWgDBo8jA5IQwoZsPyqrBQlJ3o6'

// Nombre de rounds pour le salage (plus il est élevé, plus le hachage est sécurisé mais lent)
const saltRounds = 10;

bcrypt.compare(motDePasse, useMotdPasse, (err, isMatch) => {
    if (err) {
        console.error('c\'est pas le bon mot de passe:', err);

    }

    if (isMatch) {
        console.log('Mot de passe correct');
    }
});
