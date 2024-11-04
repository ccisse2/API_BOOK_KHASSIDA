const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Fonction pour vérifier l'existence d'un répertoire et le créer si nécessaire
function ensureDirectoryExistence(directoryPath) {
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }
}

// Fonction pour convertir une image en WebP
async function convertImageToWebp(inputPath, outputPath, quality = 80) {
    try {
        await sharp(inputPath).webp({ quality }).toFile(outputPath);
        console.log(`Image convertie en WebP : ${outputPath}`);
    } catch (error) {
        throw new Error(`Erreur lors de la conversion en WebP : ${error.message}`);
    }
}

// Export des fonctions utilitaires
module.exports = {
    ensureDirectoryExistence,
    convertImageToWebp
};
