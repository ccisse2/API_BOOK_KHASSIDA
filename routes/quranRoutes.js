const express = require('express');
const router = express.Router();
const db = require('../db');
const quranModel = require('../models/quranModel');



//Récupérer tous les khassida traduits
router.get('/list_quran', (req, res) => {
    quranModel.getAllQuran( (err, results) => {
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

//Pagination
router.get('/quran_paginer', (req, res) => {
    // Récupérer les paramètres de page et de taille (avec des valeurs par défaut)
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 36;

    // Calculer le numéro de page et le nombre de pages total
    const offset = (page - 1)*limit

    // Récupérer les khassidas avec pagination
    quranModel.getQuransWithPagination(limit, offset, (err, result, totalCount) => {
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
router.post('/ajout_quran', (req, res) => {
    const { name, lienImg, lienPdf } = req.body;
    quranModel.addQuran(name, lienImg, lienPdf, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de l\'ajout du Khassida', error: err.message });
        } else {
            res.status(201).json({ id: result.insertId, name, lienImg, lienPdf });
        }
    });
});

// Modifier un Khassida
router.put('/modif_quran/:id', (req, res) => {
    const { id } = req.params;
    const { name, lienImg, lienPdf } = req.body;
    if (!name || !lienImg || !lienPdf) {
        return res.status(400).json({ message: 'Veuillez fournir toutes les informations requises.' });
    }
    quranModel.updateQuran(id, name, lienImg, lienPdf, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de la modification du Khassida', error: err.message });
        } else {
            res.json({ message: 'Modification réussie', id, name, lienImg, lienPdf });
        }
    });
});

// Supprimer un Khassida
router.delete('/suppr_quran/:id', (req, res) => {
    const { id } = req.params;
    quranModel.deleteQuran(id, (err, result) => {
        if (err) {
            res.status(500).json({ message: 'Erreur lors de la suppression du Khassida', error: err.message });
        } else {
            res.status(204).json({ message: 'Suppression réussie' });
        }
    });
});

module.exports = router;