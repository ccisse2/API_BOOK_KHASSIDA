// middlewares/uploadMiddleware.js

const multer = require('multer');
const path = require('path');

/**
 * Configuration de stockage pour multer, avec des répertoires et des noms personnalisés pour les fichiers.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Détermine la destination en fonction du type de fichier (image ou PDF)
        const dest = file.fieldname === 'lienImg' ? 'uploads/image' : 'uploads/khassida';
        cb(null, path.join(__dirname, '..', dest)); // Place le fichier dans le bon répertoire
    },
    filename: (req, file, cb) => {
        // Nomme le fichier en fonction du nom fourni dans le corps de la requête, en conservant l'extension
        const { name } = req.body;
        const ext = path.extname(file.originalname);
        cb(null, `${name}${ext}`); // Nom de fichier : <nom fourni>.<extension>
    }
});

// Crée une instance de multer avec la configuration de stockage
const upload = multer({ storage: storage });

module.exports = upload;
