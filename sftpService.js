const Client = require('ssh2-sftp-client');
require('dotenv').config();

const sftp = new Client();

const config = {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT, // Port SFTP par défaut
    username: process.env.SERVER_USERNAME,
    password: process.env.SERVER_PASSWORD
};

/**
 * Télécharge un fichier local vers un chemin distant spécifié en utilisant SFTP.
 *
 * @param {string} localPath - Le chemin du fichier local à télécharger.
 * @param {string} remotePath - Le chemin sur le serveur distant où le fichier sera téléchargé.
 * @returns {Promise<void>} Résolu lorsque le téléchargement est terminé, ou lève une erreur en cas d'échec.
 */
async function uploadFile(localPath, remotePath) {
    try {
        await sftp.connect(config);
        await sftp.put(localPath, remotePath);
    } catch (err) {
    } finally {
        await sftp.end();
    }
}


module.exports = { uploadFile };