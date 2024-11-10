const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Clé secrète pour la signature du JWT, assurez-vous qu'elle est définie dans les variables d'environnement
const secretKey = process.env.JWT_SECRET || "votre_clé_secrète";

/**
 * Contrôleur pour la connexion utilisateur.
 *
 * Cette fonction vérifie les informations de connexion fournies par l'utilisateur.
 * Si les informations sont valides, elle génère un token JWT pour authentifier l'utilisateur.
 *
 * @param {Object} req - L'objet de requête HTTP.
 * @param {Object} req.body - Le corps de la requête contenant les informations de connexion.
 * @param {string} req.body.nom - Le nom de l'utilisateur.
 * @param {string} req.body.motDePasse - Le mot de passe de l'utilisateur.
 * @param {Object} res - L'objet de réponse HTTP.
 *
 * @returns {Object} - Renvoie un token JWT et les informations de l'utilisateur si la connexion est réussie.
 */
exports.login = (req, res) => {
    const { nom, motDePasse } = req.body;
    console.log(`Tentative de connexion pour : ${nom}`);

    // Validation de l'entrée utilisateur
    if (!nom || !motDePasse) {
        return res.status(400).json({ message: 'Nom et mot de passe requis' });
    }

    // Requête pour vérifier si l'utilisateur existe dans la base de données
    const query = 'SELECT * FROM user WHERE nom = ?';
    db.query(query, [nom], (err, results) => {
        if (err) {
            console.error('Erreur lors de la requête à la base de données:', err);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }

        // Vérification si l'utilisateur existe
        if (results.length === 0) {
            return res.status(401).json({ message: 'Nom ou mot de passe incorrect' });
        }

        const user = results[0];

        // Comparaison du mot de passe haché
        bcrypt.compare(motDePasse, user.mot_de_passe, (err, isMatch) => {
            if (err) {
                console.error('Erreur lors de la comparaison des mots de passe:', err);
                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Nom ou mot de passe incorrect' });
            }

            // Génération du token JWT avec expiration de 1 heure
            const token = jwt.sign(
                { id: user.id, nom: user.nom },
                secretKey,
                { expiresIn: '1h' }
            );

            // Envoi de la réponse avec le token et les informations utilisateur
            res.status(200).json({
                message: 'Connexion réussie',
                token: token,
                user: { id: user.id, nom: user.nom }
            });
        });
    });
};
