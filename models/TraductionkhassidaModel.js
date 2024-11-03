const db = require('../db');


exports.getTraductionKhassidas = (callback) => {
    db.query('SELECT * FROM traduction_khassida', callback);
};

exports.getTraductionWithPagination = (limit, offset, callback) => {
    // Requête SQL pour récupérer les enregistrements avec la limite et l'offset
    const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM traduction_khassida LIMIT ? OFFSET ?';
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

exports.addTraductionKhassida = (name, lienImg, lienPdf, callback) => {
    db.query('INSERT INTO traduction_khassida (name, lienImg, lienPdf) VALUES (?, ?, ?)', [name, lienImg, lienPdf], callback);
};

exports.updateTraductionKhassida = (id, name, lienImg, lienPdf, callback) => {
    db.query('UPDATE traduction_khassida SET name=?, lienImg=?, lienPdf=? WHERE id=?', [name, lienImg, lienPdf, id], callback);
};

exports.deleteTraductionKhassida = (id, callback) => {
    db.query('DELETE FROM traduction_khassida WHERE id=?', [id], callback);
};