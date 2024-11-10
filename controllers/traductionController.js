const traductionkhassidaModel = require('../models/TraductionkhassidaModel');

/**
 * @swagger
 * tags:
 *   name: TraductionKhassida
 *   description: Gestion des Khassidas traduits
 */
/**
 * @swagger
 * /traduction/list_traduction_khassida:
 *   get:
 *     summary: Récupère tous les Khassidas traduits
 *     tags: [TraductionKhassida]
 *     responses:
 *       200:
 *         description: Liste de tous les Khassidas traduits
 *       500:
 *         description: Erreur interne du serveur
 */
exports.getAllTraductionKhassidas = async (req, res) => {
    try {
        const results = await traductionkhassidaModel.getTraductionKhassidas();
        res.json({
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
 * /traduction/traduction_khassida_paginer:
 *   get:
 *     summary: Récupère les Khassidas traduits avec pagination
 *     tags: [TraductionKhassida]
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
 *         description: Nombre de résultats par page
 *     responses:
 *       200:
 *         description: Liste paginée des Khassidas traduits
 *       500:
 *         description: Erreur interne du serveur
 */
exports.getTraductionWithPagination = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 36;
    const offset = (page - 1) * limit;

    try {
        const { rows, totalCount } = await traductionkhassidaModel.getTraductionWithPagination(limit, offset);
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
 *
 * /traduction/ajout_khassida_traduit:
 *   post:
 *     summary: Ajoute un nouveau Khassida traduit
 *     tags: [TraductionKhassida]
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
 *         description: Khassida ajouté avec succès
 *       500:
 *         description: Erreur lors de l'ajout
 */
/*exports.addTraductionKhassida = async (req, res) => {
    const { name, lienImg, lienPdf } = req.body;
    try {
        const result = await traductionkhassidaModel.addTraductionKhassida(name, lienImg, lienPdf);
        res.status(201).json({
            id: result.insertId,
            name,
            lienImg,
            lienPdf
        });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout du Khassida', error: err.message });
    }
};*/

/**
 *
 * /traduction/modif_khassida_traduit/{id}:
 *   put:
 *     summary: Modifie un Khassida traduit
 *     tags: [TraductionKhassida]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Khassida traduit à modifier
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
 *       200:
 *         description: Khassida modifié avec succès
 *       500:
 *         description: Erreur lors de la modification
 */
/*exports.updateTraductionKhassida = async (req, res) => {
    const { id } = req.params;
    const { name, lienImg, lienPdf } = req.body;

    if (!name || !lienImg || !lienPdf) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
    }

    try {
        await traductionkhassidaModel.updateTraductionKhassida(id, name, lienImg, lienPdf);
        res.json({ message: 'Modification réussie', id, name, lienImg, lienPdf });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la modification du Khassida', error: err.message });
    }
};*/

/**
 *
 * /traduction/suppr_khassida_traduit/{id}:
 *   delete:
 *     summary: Supprime un Khassida traduit
 *     tags: [TraductionKhassida]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du Khassida traduit à supprimer
 *     responses:
 *       204:
 *         description: Khassida supprimé avec succès
 *       500:
 *         description: Erreur lors de la suppression
 */
/*exports.deleteTraductionKhassida = async (req, res) => {
    const { id } = req.params;

    try {
        await traductionkhassidaModel.deleteTraductionKhassida(id);
        res.status(204).json({ message: 'Suppression réussie' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur lors de la suppression du Khassida', error: err.message });
    }
};*/
