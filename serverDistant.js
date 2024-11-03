const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');

const sftp = new Client();

const config = {
    host: '91.108.101.62',
    port: 65002, // Port SFTP par défaut
    username: 'u634672165',
    password: 'CC2e2chk02@'
};

async function uploadFile(localPath, remotePath) {
    try {
        await sftp.connect(config);
        await sftp.put(localPath, remotePath);
        console.log('Fichier téléchargé avec succès.');
    } catch (err) {
        console.error('Erreur lors du téléchargement du fichier :', err);
    } finally {
        await sftp.end();
    }
}

// Exemple d'utilisation
const localFilePath = path.resolve(__dirname, 'Module 01 - Support de cours.pdf');
const remoteFilePath = 'public_html/khassida-pdf/Module-01-Support-de-cours.pdf'; // Spécifiez le nom du fichier

uploadFile(localFilePath, remoteFilePath);
