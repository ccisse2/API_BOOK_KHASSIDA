const Client = require('ssh2-sftp-client');

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
    } catch (err) {
    } finally {
        await sftp.end();
    }
}

module.exports = { uploadFile };