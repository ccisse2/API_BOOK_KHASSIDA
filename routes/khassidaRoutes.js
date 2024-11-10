const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const khassidaController = require('../controllers/khassidaController');
const loginController = require('../controllers/loginController');
const upload = require('../middleware/uploadMiddleware');
const {searchLimiter} = require("../utils/fileUtils");

/**
 * @swagger
 * /list_khassida:
 *   get:
 *     summary: Récupérer tous les Khassidas
 *     description: Récupère la liste complète des Khassidas.
 *     responses:
 *       200:
 *         description: Succès de la récupération.
 *       500:
 *         description: Erreur lors de la récupération des Khassidas.
 */
router.get('/list_khassida', khassidaController.getAllKhassidas);

/**
 * @swagger
 * /ajout_khassida:
 *   post:
 *     summary: Télécharger et enregistrer un Khassida
 *     description: Upload d'un fichier image et PDF pour un Khassida et enregistrement dans la base de données.
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: lienImg
 *         type: file
 *         description: L'image du Khassida en format WebP.
 *       - in: formData
 *         name: lienPdf
 *         type: file
 *         description: Le fichier PDF du Khassida.
 *     responses:
 *       200:
 *         description: Fichier uploadé et enregistrement réussi.
 *       500:
 *         description: Erreur lors de l'upload ou de l'enregistrement du fichier.
 */
router.post('/ajout_khassida', upload.fields([{name: 'lienImg', maxCount: 1}, {name: 'lienPdf', maxCount: 1}]),
    khassidaController.uploadAndSaveKhassida);

/**
 * @swagger
 * /list:
 *   get:
 *     summary: Récupérer les Khassidas avec pagination
 *     description: Récupère la liste des Khassidas avec pagination.
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
 *         description: Récupération réussie des Khassidas avec pagination.
 *       500:
 *         description: Erreur lors de la récupération avec pagination.
 */
router.get('/list', khassidaController.getKhassidasList);

/**
 *
 * /ajout_khassida:
 *   post:
 *     summary: Ajouter un nouveau Khassida
 *     description: Ajoute un nouveau Khassida dans la base de données.
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
router.post('/ajout_khassida', khassidaController.addKhassida);

/**
 * @swagger
 * /search:
 *   get:
 *     summary: Rechercher un Khassida
 *     description: Recherche un Khassida par nom.
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: La requête de recherche.
 *     responses:
 *       200:
 *         description: Succès de la recherche.
 *       429:
 *         description: Trop de requêtes. Veuillez réessayer plus tard.
 *       500:
 *         description: Erreur lors de la recherche du Khassida.
 */
router.get('/search', searchLimiter, khassidaController.searchKhassida);

/**
 *
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifie l'utilisateur et génère un token JWT.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *               motDePasse:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie avec token JWT.
 *       400:
 *         description: Nom et mot de passe requis.
 *       401:
 *         description: Nom ou mot de passe incorrect.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/login', loginController.login);

module.exports = router;
