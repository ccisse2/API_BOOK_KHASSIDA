const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const {uploadFile} = require("../sftpService");
const rateLimit = require("express-rate-limit");


/**
 * Assure qu'un répertoire existe, en le créant s'il n'existe pas.
 *
 * @param {string} directoryPath - Le chemin du répertoire à vérifier/créer.
 */
function ensureDirectoryExistence(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}


/**
 * Convertit un fichier image en format WebP.
 *
 * @param {string} inputPath - Le chemin du fichier image d'entrée.
 * @param {string} outputPath - Le chemin où l'image WebP convertie sera enregistrée.
 * @returns {Promise<void>} Résolu lorsque la conversion est terminée, ou lève une erreur en cas d'échec.
 */
async function convertImageToWebp(inputPath, outputPath, quality = 80) {
    try {
        await sharp(inputPath)
            .webp({ quality })
            .toFile(outputPath);
    } catch (error) {
        throw new Error(`Erreur lors de la conversion en WebP : ${error.message}`);
    }
}


/**
 * Processes an image file by converting it to WebP format, uploading it to the server, and generating its URL.
 *
 * @param {Object} imgFile - The image file object.
 * @param {string} name - The name used for renaming the file.
 * @returns {Promise<string>} The URL of the uploaded image.
 */
async function processImageFile(imgFile, name) {
    const tempImgPath = path.join('uploads/image', imgFile.filename);
    const convertedImgPath = path.join('uploads/image', `${name}.webp`);

    ensureDirectoryExistence(path.join('uploads/image'));
    await convertImageToWebp(tempImgPath, convertedImgPath);

    const remoteImgPath = `public_html/image-khassida/${name}.webp`;
    await uploadFile(convertedImgPath, remoteImgPath);

    return `https://khassidapdf.com/image-khassida/${name}.webp`;
}

/**
 * Processes a PDF file by renaming it, uploading it to the server, and generating its URL.
 *
 * @param {Object} pdfFile - The PDF file object.
 * @param {string} name - The name used for renaming the file.
 * @returns {Promise<string>} The URL of the uploaded PDF.
 */
async function processPdfFile(pdfFile, name) {
    const localPdfPath = path.join('uploads/khassida', `${name}.pdf`);

    ensureDirectoryExistence(path.join('uploads/khassida'));
    fs.renameSync(path.join('uploads/khassida', pdfFile.filename), localPdfPath);

    const remotePdfPath = `public_html/khassida-pdf/${name}.pdf`;
    await uploadFile(localPdfPath, remotePdfPath);

    return `https://khassidapdf.com/khassida-pdf/${name}.pdf`;
}

const searchLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limite chaque IP à 100 requêtes par windowMs
    message: 'Trop de requêtes, veuillez réessayer plus tard.',
});


// Export des fonctions utilitaires
module.exports = {
    processImageFile,
    processPdfFile,
    searchLimiter,
};
