const db = require('../db');

exports.getAllQuran = async () => {
    const [results] = await db.promise().query('SELECT * FROM quran');
    return results;
};

exports.getQuransWithPagination = async (limit, offset) => {
    const query = 'SELECT SQL_CALC_FOUND_ROWS * FROM quran LIMIT ? OFFSET ?';
    const [rows] = await db.promise().query(query, [limit, offset]);

    const [totalRows] = await db.promise().query('SELECT FOUND_ROWS() AS total');
    const totalCount = totalRows[0].total;

    return { rows, totalCount };
};

exports.addQuran = async (name, lienImg, lienPdf) => {
    const [result] = await db.promise().query(
        'INSERT INTO quran (name, lienImg, lienPdf) VALUES (?, ?, ?)',
        [name, lienImg, lienPdf]
    );
    return result;
};

exports.updateQuran = async (id, name, lienImg, lienPdf) => {
    const [result] = await db.promise().query(
        'UPDATE quran SET name=?, lienImg=?, lienPdf=? WHERE id=?',
        [name, lienImg, lienPdf, id]
    );
    return result;
};

exports.deleteQuran = async (id) => {
    const [result] = await db.promise().query(
        'DELETE FROM quran WHERE id=?',
        [id]
    );
    return result;
};
