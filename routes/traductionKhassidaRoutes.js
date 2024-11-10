const express = require('express');
const router = express.Router();
const traductionKhassidaController = require('../controllers/traductionController');

// Récupérer tous les Khassidas traduits
router.get('/list_traduction_khassida', traductionKhassidaController.getAllTraductionKhassidas);

// Pagination
router.get('/traduction_khassida_paginer', traductionKhassidaController.getTraductionWithPagination);

// Ajouter un nouveau Khassida traduit
/*router.post('/ajout_khassida_traduit', traductionKhassidaController.addTraductionKhassida);

// Modifier un Khassida traduit
router.put('/modif_khassida_traduit/:id', traductionKhassidaController.updateTraductionKhassida);

// Supprimer un Khassida traduit
router.delete('/suppr_khassida_traduit/:id', traductionKhassidaController.deleteTraductionKhassida);*/

module.exports = router;
