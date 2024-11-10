const khassidaModel = require("../models/khassidaModel");
const {  processImageFile, processPdfFile } = require('../utils/fileUtils');
const validator = require('validator');
const db = require('../db');



/**
 * @swagger
 * /khassida/list_khassida:
 *   get:
 *     summary: Récupère tous les Khassidas
 *     description: Cette route permet de récupérer la liste complète des Khassidas.
 *     tags: [Quassida]
 *     responses:
 *       200:
 *         description: Succès de la récupération.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Khassida'
 *       500:
 *         description: Erreur lors de la récupération des Khassidas.
 */
exports.getAllKhassidas = async (req, res) => {
    try {
        const results = await khassidaModel.findAll();
        res.status(200).json({
            message: 'Récupération réussie',
            data: results
        });
    } catch (err) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des Khassidas',
            error: err.message
        });
    }
};


/**
 * @swagger
 * /khassida/list:
 *   get:
 *     summary: Récupère une liste paginée de Khassidas
 *     tags: [Quassida]
 *     description: Cette route permet de récupérer des Khassidas avec pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre de résultats par page.
 *     responses:
 *       200:
 *         description: Succès de la récupération avec pagination.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Khassida'
 *                 totalItems:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Erreur lors de la récupération des Khassidas avec pagination.
 */
exports.getKhassidasList = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 36;
    const offset = (page - 1) * limit;

    try {
        const { rows, totalCount } = await khassidaModel.getKhassidasWithPagination(limit, offset);
        res.json({
            message: 'Récupération réussie',
            data: rows,
            totalItems: totalCount,
            currentPage: page,
            totalPages: Math.ceil(totalCount / limit)
        });
    } catch (err) {
        res.status(500).json({
            message: 'Erreur lors de la récupération des Khassidas',
            error: err.message
        });
    }
};


/**
 * @swagger
 * /khassida/ajout_khassida:
 *   post:
 *     summary: Télécharge les fichiers image et PDF pour un Khassida
 *     tags: [Quassida]
 *     description: Cette route permet de télécharger une image et un PDF pour un Khassida, de les traiter et de les stocker.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lienImg:
 *                 type: string
 *                 format: binary
 *               lienPdf:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Fichiers uploadés et enregistrement ajouté avec succès.
 *       500:
 *         description: Erreur lors de l'upload ou de l'enregistrement.
 */
exports.uploadAndSaveKhassida = async (req, res) => {
    try {
        const { name } = req.body;
        const imgFile = req.files.lienImg[0];
        const pdfFile = req.files.lienPdf[0];

        // Process the image and PDF files, and generate their URLs
        const lienImgUrl = await processImageFile(imgFile, name);
        const lienPdfUrl = await processPdfFile(pdfFile, name);

        // Insert the image and PDF URLs into the database
        await khassidaModel.addKhassida(name, lienImgUrl, lienPdfUrl);
        res.status(200).json({ message: 'Fichier uploadé et enregistrement ajouté avec succès' });

    } catch (error) {
        res.status(500).json({ message: 'Failed to upload file or insert record', error: error.message });
    }
};


/**
 *
 * /khassida/ajout_khassida:
 *   post:
 *     summary: Ajoute un nouveau Khassida
 *     tags: [Quassida]
 *     description: Cette route permet d'ajouter un nouveau Khassida avec son nom, son image et son PDF.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               lienImg:
 *                 type: string
 *               lienPdf:
 *                 type: string
 *     responses:
 *       201:
 *         description: Khassida ajouté avec succès.
 *       500:
 *         description: Erreur lors de l'ajout du Khassida.
 */
exports.addKhassida = (req, res) => {
    const { name, lienImg, lienPdf } = req.body;

    khassidaModel.addKhassida(name, lienImg, lienPdf, (err, result) => {
        if (err) {
            return res.status(500).json({
                message: 'Erreur lors de l\'ajout du Khassida',
                error: err.message
            });
        }
        res.status(201).json({
            id: result.insertId,
            name,
            lienImg,
            lienPdf
        });
    });
};


/**
 * @swagger
 * /khassida/search:
 *   get:
 *     summary: Recherche des Khassidas par nom
 *     tags: [Quassida]
 *     description: Cette route permet de rechercher des Khassidas par leur nom.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Terme de recherche pour le nom du Khassida.
 *     responses:
 *       200:
 *         description: Succès de la recherche.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Khassida'
 *       400:
 *         description: Paramètre de recherche invalide.
 *       500:
 *         description: Erreur lors de la recherche du Khassida.
 */
exports.searchKhassida = async (req, res) => {
    try {
        let query = req.query.q;

        // Validation du paramètre de recherche
        if (!query || !validator.isAlphanumeric(query, 'fr-FR')) {
            return res.status(400).json({ message: 'Invalid query parameter' });
        }

        // Normaliser l'entrée pour supprimer les accents et convertir en minuscules
        query = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

        // Requête SQL avec une limite de résultats
        const sqlQuery = 'SELECT * FROM khassidas WHERE LOWER(name) LIKE ? LIMIT 15';
        const values = [`${query}%`];

        // Exécution de la requête SQL de manière asynchrone
        const [results] = await db.promise().query(sqlQuery, values);

        // Retour des résultats
        res.status(200).json({ data: results });
    } catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};