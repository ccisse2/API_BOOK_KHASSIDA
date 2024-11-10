const db = require('../db');

/**
 * Récupère tous les Khassidas traduits.
 * @returns {Promise<Array>} - Une promesse qui résout avec les résultats de la requête.
 */
exports.getTraductionKhassidas = async () => {
    const query = 'SELECT * FROM traduction_khassida';
    try {
        const [results] = await db.promise().query(query);
        return results;
    } catch (err) {
        throw new Error(`Erreur lors de la récupération des Khassidas traduits: ${err.message}`);
    }
};

/**
 * Récupère les Khassidas traduits avec pagination.
 * @param {number} limit - Nombre de résultats par page.
 * @param {number} offset - Décalage des résultats.
 * @returns {Promise<Object>} - Une promesse qui résout avec les lignes de la page et le nombre total de résultats.
 */
exports.getTraductionWithPagination = async (limit, offset) => {
    const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM traduction_khassida LIMIT ? OFFSET ?';
    try {
        // Exécute la requête de pagination
        const [rows] = await db.promise().query(query, [limit, offset]);

        // Exécute la requête pour obtenir le nombre total de résultats
        const [totalRows] = await db.promise().query('SELECT FOUND_ROWS() AS total');
        const totalCount = totalRows[0].total;

        return {
            rows,
            totalCount
        };
    } catch (err) {
        throw new Error(`Erreur lors de la récupération des Khassidas avec pagination: ${err.message}`);
    }
};

/**
 * Ajoute un nouveau Khassida traduit dans la base de données.
 * @param {string} name - Nom du Khassida traduit.
 * @param {string} lienImg - Lien vers l'image du Khassida traduit.
 * @param {string} lienPdf - Lien vers le PDF du Khassida traduit.
 * @returns {Promise<Object>} - Une promesse qui résout avec les informations de l'insertion.
 */
exports.addTraductionKhassida = async (name, lienImg, lienPdf) => {
    const query = 'INSERT INTO traduction_khassida (name, lienImg, lienPdf) VALUES (?, ?, ?)';
    try {
        const [result] = await db.promise().query(query, [name, lienImg, lienPdf]);
        return result;
    } catch (err) {
        throw new Error(`Erreur lors de l'ajout du Khassida traduit: ${err.message}`);
    }
};

/**
 * Met à jour un Khassida traduit existant dans la base de données.
 * @param {number} id - ID du Khassida traduit.
 * @param {string} name - Nouveau nom du Khassida traduit.
 * @param {string} lienImg - Nouveau lien vers l'image.
 * @param {string} lienPdf - Nouveau lien vers le PDF.
 * @returns {Promise<void>}
 */
exports.updateTraductionKhassida = async (id, name, lienImg, lienPdf) => {
    const query = 'UPDATE traduction_khassida SET name=?, lienImg=?, lienPdf=? WHERE id=?';
    try {
        await db.promise().query(query, [name, lienImg, lienPdf, id]);
    } catch (err) {
        throw new Error(`Erreur lors de la mise à jour du Khassida traduit: ${err.message}`);
    }
};

/**
 * Supprime un Khassida traduit de la base de données.
 * @param {number} id - ID du Khassida traduit à supprimer.
 * @returns {Promise<void>}
 */
exports.deleteTraductionKhassida = async (id) => {
    const query = 'DELETE FROM traduction_khassida WHERE id=?';
    try {
        await db.promise().query(query, [id]);
    } catch (err) {
        throw new Error(`Erreur lors de la suppression du Khassida traduit: ${err.message}`);
    }
};
