const Client = require('ssh2-sftp-client');
require('dotenv').config();

const sftp = new Client();

const config = {
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT, // Port SFTP par défaut
    username: process.env.SERVER_USERNAME,
    password: process.env.SERVER_PASSWORD
};

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