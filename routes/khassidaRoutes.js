const express = require('express');
const router = express.Router();
const db = require('../db');
const khassidaModel = require('../models/khassidaModel');
const multer = require('multer');
const path = require('path');
const {uploadFile} = require('../serverDistant');
const { ensureDirectoryExistence, convertImageToWebp } = require('../utils/fileUtils');
const fs = require('fs');
const bcrypt = require('bcrypt');
const rateLimit = require('express-rate-limit');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
require('dotenv').config();





const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par windowMs
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
});



// Configuration de multer avec un nom personnalisé pour le fichier
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dest = file.fieldname === 'lienImg' ? 'uploads/image' : 'uploads/khassida';
        cb(null, path.join(__dirname, dest));
    },
    filename: (req, file, cb) => {
        const { name } = req.body;
        const ext = path.extname(file.originalname);
        cb(null, `${name}${ext}`);
    }
});

const upload = multer({storage: storage});

//Récupérer tous les khassida
router.get('/list_khassida', (req, res) => {
    khassidaModel.getAllKhassidas((err, results) => {
        if (err) {
            res.status(500).json({
                message: 'Erreur lors de la récupération des Khassidas',
                error: err.message // Vous pouvez aussi inclure plus de détails sur l'erreur si nécessaire
            });
        } else {
            res.json({
                message: 'Récupération réussie',
                data: results
            });
        }
    });
});


router.post('/upload-file', upload.fields([{ name: 'lienImg', maxCount: 1 }, { name: 'lienPdf', maxCount: 1 }]), async (req, res) => {
    try {
        const { name } = req.body;
        const imgFile = req.files.lienImg[0];
        const pdfFile = req.files.lienPdf[0];

        // Conversion de l'image en WebP
        const tempImgPath = path.join(__dirname, 'uploads/image', imgFile.filename);
        const convertedImgPath = path.join(__dirname, 'uploads/image', `${name}.webp`);
        await convertImageToWebp(tempImgPath, convertedImgPath);

        // Assurez-vous que les répertoires existent
        ensureDirectoryExistence(path.join(__dirname, 'uploads/image'));
        ensureDirectoryExistence(path.join(__dirname, 'uploads/khassida'));

        // Déplacer les fichiers pour le stockage définitif
        const localPdfPath = path.join(__dirname, 'uploads/khassida', `${name}.pdf`);
        fs.renameSync(path.join(__dirname, 'uploads/khassida', pdfFile.filename), localPdfPath);

        // Upload vers le serveur distant
        await uploadFile(convertedImgPath, `public_html/image-khassida/${name}.webp`);
        await uploadFile(localPdfPath, `public_html/khassida-pdf/${name}.pdf`);

        // Construire les URLs pour l'insertion en base de données
        const lienImgUrl = `https://khassidapdf.com/image-khassida/${name}.webp`;
        const lienPdfUrl = `https://khassidapdf.com/khassida-pdf/${name}.pdf`;

        // Insertion dans la base de données
        khassidaModel.addKhassida(
            name,
            lienImgUrl,
            lienPdfUrl,
            (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Failed to insert record into database', error: err });
                }
                res.status(200).json({
                    message: 'File uploaded and record inserted successfully',
                    data: { id: result.insertId, name, lienImg: lienImgUrl, lienPdf: lienPdfUrl }
                });
            }
        );
    } catch (error) {
        res.status(500).json({ message: 'Failed to upload file or insert record', error: error.message });
    }
});

//Pagination
router.get('/list', (req, res) => {
    // Récupérer les paramètres de page et de taille (avec des valeurs par défaut)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 36;

    // Calculer le numéro de page et le nombre de pages total
    const offset = (page - 1) * limit

    // Récupérer les khassidas avec pagination
    khassidaModel.getKhassidasWithPagination(limit, offset, (err, result, totalCount) => {
        if (err) {
            res.status(500).json(
                {
                    message: 'Erreur lors de la récupération des Khassidas',
                    error: err.message
                });
        } else {
            res.json({
                message: 'Récupération réussie',
                data: result,
                totalItems: totalCount,
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit)
            });
        }
    })
})

//Ajouter un nouveau khassida
router.post('/ajout_khassida', (req, res) => {
    const {name, lienImg, lienPdf} = req.body;
    khassidaModel.addKhassida(name, lienImg, lienPdf, (err, result) => {
        if (err) {
            res.status(500).json({message: 'Erreur lors de l\'ajout du Khassida', error: err.message});
        } else {
            res.status(201).json({id: result.insertId, name, lienImg, lienPdf});
        }
    });
});

// Modifier un Khassida
router.put('/modif_khassida/:id', (req, res) => {
    const {id} = req.params;
    const {name, lienImg, lienPdf} = req.body;
    if (!name || !lienImg || !lienPdf) {
        return res.status(400).json({message: 'Veuillez fournir toutes les informations requises.'});
    }
    khassidaModel.updateKhassida(id, name, lienImg, lienPdf, (err, result) => {
        if (err) {
            res.status(500).json({message: 'Erreur lors de la modification du Khassida', error: err.message});
        } else {
            res.json({message: 'Modification réussie', id, name, lienImg, lienPdf});
        }
    });
});

// Supprimer un Khassida
router.delete('/suppr_khassida/:id', (req, res) => {
    const {id} = req.params;
    khassidaModel.deleteKhassida(id, (err, result) => {
        if (err) {
            res.status(500).json({message: 'Erreur lors de la suppression du Khassida', error: err.message});
        } else {
            res.status(204).json({message: 'Suppression réussie'});
        }
    });
});

router.get('/search', searchLimiter, (req, res) => {
    let query = req.query.q;

    if (!query || !validator.isAlphanumeric(query, 'fr-FR')) {
        return res.status(400).json({ message: 'Invalid query parameter' });
    }

    const sqlQuery = 'SELECT * FROM khassidas WHERE LOWER(name) LIKE ?';
    const values = [`${query.toLowerCase()}%`];

    db.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Failed to search records', error: err });
        }

        res.status(200).json({ data: results });
    });
});

router.post('/login', (req, res) => {
    const { nom, motDePasse } = req.body;
    console.log(`dans la route post login : ${nom}`)

    if (!nom || !motDePasse) {
        return res.status(400).json({ message: 'Nom et mot de passe requis' });
    }

    // Rechercher l'utilisateur dans la base de données
    const query = 'SELECT * FROM user WHERE nom = ?';
    db.query(query, [nom], (err, results) => {
        if (err) {
            console.error('Erreur lors de la requête à la base de données:', err);
            return res.status(500).json({ message: 'Erreur interne du serveur' });
        }

        // Vérifier si l'utilisateur existe
        if (results.length === 0) {
            return res.status(401).json({ message: 'Nom ou mot de passe incorrect' });
        }

        const user = results[0];

        // Comparer le mot de passe haché avec celui fourni par l'utilisateur
        bcrypt.compare(motDePasse, user.mot_de_passe, (err, isMatch) => {
            if (err) {
                console.error('Erreur lors de la comparaison des mots de passe:', err);
                return res.status(500).json({ message: 'Erreur interne du serveur' });
            }

            if (!isMatch) {
                return res.status(401).json({ message: 'Nom ou mot de passe incorrect' });
            }
            // Génération du token JWT
            const token = jwt.sign({ id: user.id, nom: user.nom }, secretKey, { expiresIn: '1h' });


            // Si l'authentification est réussie
            res.status(200).json({ message: 'Connexion réussie',
                token: token,
                user: { id: user.id, nom: user.nom }  });
        });
    });
});

module.exports = router;