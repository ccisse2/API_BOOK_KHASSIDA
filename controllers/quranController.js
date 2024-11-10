const quranModel = require('../models/quranModel');

/**
 * @swagger
 * /quran/list_quran:
 *   get:
 *     summary: Récupère tous les enregistrements de la table Quran.
 *     tags: [Quran]
 *     responses:
 *       200:
 *         description: Liste de tous les enregistrements de Quran.
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       lienImg:
 *                         type: string
 *                       lienPdf:
 *                         type: string
 */
exports.getAllQuran = async (req, res) => {
    try {
        const results = await quranModel.getAllQuran();
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
 * /quran/quran_paginer:
 *   get:
 *     summary: Récupère les enregistrements de Quran avec pagination.
 *     tags: [Quran]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Nombre d'enregistrements par page
 *     responses:
 *       200:
 *         description: Liste paginée des enregistrements de Quran.
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
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       name:
 *                         type: string
 *                       lienImg:
 *                         type: string
 *                       lienPdf:
 *                         type: string
 *                 totalItems:
 *                   type: integer
 *                 currentPage:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 */
exports.getQuransWithPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 36;
    const offset = (page - 1) * limit;

    try {
        const { rows, totalCount } = await quranModel.getQuransWithPagination(limit, offset);
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
 * /quran/ajout_quran:
 *   post:
 *     summary: Ajoute un nouvel enregistrement dans la table Quran.
 *     tags: [Quran]
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
 *         description: Enregistrement ajouté avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *                 lienImg:
 *                   type: string
 *                 lienPdf:
 *                   type: string
 */
exports.addQuran = async (req, res) => {
    const { name, lienImg, lienPdf } = req.body;

    try {
        const result = await quranModel.addQuran(name, lienImg, lienPdf);
        res.status(201).json({
            id: result.insertId,
            name,
            lienImg,
            lienPdf
        });
    } catch (err) {
        res.status(500).json({
            message: 'Erreur lors de l\'ajout du Khassida',
            error: err.message
        });
    }
};
