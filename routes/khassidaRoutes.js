const express = require('express');
const router = express.Router();
const db = require('../db');
const khassidaModel = require('../models/khassidaModel');
const multer = require('multer');
const path = require('path');
const {uploadFile} = require('../serverDistant');
const { ensureDirectoryExistence, convertImageToWebp } = require('../utils/fileUtils');
const fs = require('fs');



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

router.get('/search', (req, res) => {
    const query = req.query.q;

    if (!query) {
        return res.status(400).json({ message: 'Query parameter is required' });
    }

    const sqlQuery = 'SELECT * FROM khassidas WHERE name LIKE ?';
    const values = [`%${query}%`];

    db.query(sqlQuery, values, (err, results) => {
        if (err) {
            console.error('Database query error:', err);
            return res.status(500).json({ message: 'Failed to search records', error: err });
        }

        res.status(200).json({ data: results });
    });
});

module.exports = router;