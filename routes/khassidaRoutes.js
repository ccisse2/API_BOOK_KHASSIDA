const express = require('express');
const router = express.Router();
const db = require('../db');
const khassidaModel = require('../models/khassidaModel');
const multer = require('multer');
const path = require('path');
const upload = multer({ dest: 'uploads/' });
const { uploadFile } = require('../serverDistant');

//Récupérer tous les khassida
router.get('/list_khassida', (req, res) => {
    khassidaModel.getAllKhassidas( (err, results) => {
        if (err){
            res.status(500).json({
                message: 'Erreur lors de la récupération des Khassidas',
                error: err.message // Vous pouvez aussi inclure plus de détails sur l'erreur si nécessaire
            });
        }else {
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

        if (!req.files || !req.files.lienImg || !req.files.lienPdf) {
            return res.status(400).json({ message: 'Both image and PDF files are required' });
        }

        const localImgPath = path.join(__dirname, 'uploads/image', req.files.lienImg[0].filename);
        const localPdfPath = path.join(__dirname, 'uploads/khassida', req.files.lienPdf[0].filename);

        const remoteImgPath = `public_html/image-khassida/${req.files.lienImg[0].originalname}`;
        const remotePdfPath = `public_html/khassida-pdf/${req.files.lienPdf[0].originalname}`;

        // Téléchargement des fichiers sur le serveur SFTP
        await uploadFile(localImgPath, remoteImgPath);
        await uploadFile(localPdfPath, remotePdfPath);

        // Insertion des données dans la base de données
        const query = 'INSERT INTO khassida (name, lienImg, lienPdf) VALUES (?, ?, ?)';
        const values = [name, `https://khassidapdf.com/image-khassida/${req.files.lienImg[0].originalname}`, `https://khassidapdf.com/khassida-pdf/${req.files.lienPdf[0].originalname}`];

        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Database insertion error:', err);
                return res.status(500).json({ message: 'Failed to insert record into database', error: err });
            }

            res.status(200).json({ message: 'File uploaded and record inserted successfully', data: { id: result.insertId, name, lienImg: values[1], lienPdf: values[2] } });
        });
    } catch (error) {
        console.error('File upload or database error:', error);
        res.status(500).json({ message: 'Failed to upload file or insert record', error });
    }
});


//Pagination
router.get('/list', (req, res) => {
    // Récupérer les paramètres de page et de taille (avec des valeurs par défaut)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 36;

    // Calculer le numéro de page et le nombre de pages total
    const offset = (page - 1)*limit

    // Récupérer les khassidas avec pagination
    khassidaModel.getKhassidasWithPagination(limit, offset, (err, result, totalCount) => {
        if (err) {
            res.status(500).json(
                { message: 'Erreur lors de la récupération des Khassidas',
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
    const { name, lienImg, lienPdf } = req.body;
    khassidaModel.addKhassida(name, lienImg, lienPdf, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de l\'ajout du Khassida', error: err.message });
        } else {
            res.status(201).json({ id: result.insertId, name, lienImg, lienPdf });
        }
    });
});

// Modifier un Khassida
router.put('/modif_khassida/:id', (req, res) => {
    const { id } = req.params;
    const { name, lienImg, lienPdf } = req.body;
    if (!name || !lienImg || !lienPdf) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
    }
    khassidaModel.updateKhassida(id, name, lienImg, lienPdf, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de la modification du Khassida', error: err.message });
        } else {
            res.json({ message: 'Modification réussie', id, name, lienImg, lienPdf });
        }
    });
});

// Supprimer un Khassida
router.delete('/suppr_khassida/:id', (req, res) => {
    const { id } = req.params;
    khassidaModel.deleteKhassida(id, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de la suppression du Khassida', error: err.message });
        } else {
            res.status(204).json({ message: 'Suppression réussie' });
        }
    });
});

module.exports = router;