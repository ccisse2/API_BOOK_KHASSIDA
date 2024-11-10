// models/khassidaModel.js
const db = require('../db');

exports.getAllKhassidas = (callback) => {
    db.query('SELECT * FROM khassidas', callback);
};

exports.addKhassida = (name, lienImg, lienPdf, callback) => {
    const query = 'INSERT INTO khassidas (name, lienImg, lienPdf) VALUES (?, ?, ?)';
    const values = [name, lienImg, lienPdf];
    db.query(query, values, callback);
};

exports.updateKhassida = (id, name, lienImg, lienPdf, callback) => {
    db.query('UPDATE khassidas SET name=?, lienImg=?, lienPdf=? WHERE id=?', [name, lienImg, lienPdf, id], callback);
};

exports.deleteKhassida = (id, callback) => {
    db.query('DELETE FROM khassidas WHERE id=?', [id], callback);
};

exports.getKhassidasWithPagination = async (limit, offset) => {
    try {
        // Requête SQL pour récupérer les enregistrements avec la limite et l'offset
        const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM khassidas LIMIT ? OFFSET ?';

        // Première requête pour récupérer les enregistrements
        const [rows] = await db.promise().query(query, [limit, offset]);

        // Deuxième requête pour récupérer le nombre total de lignes
        const [totalRows] = await db.promise().query('SELECT FOUND_ROWS() AS total');
        const totalCount = totalRows[0].total;

        // Retour des résultats et du total
        return {
            rows,
            totalCount
        };
    } catch (err) {
        console.error('Error during pagination query:', err);
        throw err;  // Lancer une erreur pour que l'appelant puisse la gérer
    }
};


exports.findAll = async () => {
    try {
        const [rows] = await db.promise().query('SELECT * FROM khassidas');
        return rows;
    } catch (error) {
        console.error(error);
        throw error;
    }
}
