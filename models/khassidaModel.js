// models/khassidaModel.js
const db = require('../db');

exports.getAllKhassidas = (callback) => {
    db.query('SELECT * FROM khassidas', callback);
};

exports.addKhassida = (name, lienImg, lienPdf, callback) => {
    db.query('INSERT INTO khassidas (name, lienImg, lienPdf) VALUES (?, ?, ?)', [name, lienImg, lienPdf], callback);
};

exports.updateKhassida = (id, name, lienImg, lienPdf, callback) => {
    db.query('UPDATE khassidas SET name=?, lienImg=?, lienPdf=? WHERE id=?', [name, lienImg, lienPdf, id], callback);
};

exports.deleteKhassida = (id, callback) => {
    db.query('DELETE FROM khassidas WHERE id=?', [id], callback);
};

exports.getKhassidasWithPagination = (limit, offset, callback) => {
    // Requête SQL pour récupérer les enregistrements avec la limite et l'offset
    const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM khassidas LIMIT ? OFFSET ?';
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