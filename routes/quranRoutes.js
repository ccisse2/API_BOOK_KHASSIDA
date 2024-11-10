const express = require('express');
const router = express.Router();
const quranController = require('../controllers/quranController');


router.get('/list_quran', quranController.getAllQuran);


router.get('/quran_paginer', quranController.getQuransWithPagination);


router.post('/ajout_quran', quranController.addQuran);

module.exports = router;
