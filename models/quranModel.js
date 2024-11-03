// models/khassidaModel.js
const db = require('../db');

exports.getAllQuran = (callback) => {
    db.query('SELECT * FROM quran', callback);
};

exports.getQuransWithPagination = (limit, offset, callback) => {
    // Requête SQL pour récupérer les enregistrements avec la limite et l'offset
    const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM quran LIMIT ? OFFSET ?';
    db.query(query, [limit, offset], (err, rows) => {
        if (err) {
            return callback(err);
        }
        // Récupération du nombre total de lignes trouvées pour la pagination
        db.query('SELECT FOUND_ROWS() AS total', (err, totalRows) => {
            if (err){
                return callback(err);
            }
            callback(null, rows, totalRows[0].total);
        });
    })
};

exports.addQuran = (name, lienImg, lienPdf, callback) => {
    db.query('INSERT INTO quran (name, lienImg, lienPdf) VALUES (?, ?, ?)', [name, lienImg, lienPdf], callback);
};

exports.updateQuran = (id, name, lienImg, lienPdf, callback) => {
    db.query('UPDATE quran SET name=?, lienImg=?, lienPdf=? WHERE id=?', [name, lienImg, lienPdf, id], callback);
};

exports.deleteQuran = (id, callback) => {
    db.query('DELETE FROM quran WHERE id=?', [id], callback);
};

