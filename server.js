const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const khassidaRoutes = require('./routes/khassidaRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT =  3000;

app.use(cors());
app.use(bodyParser.json());
app.use(errorHandler)

app.use('/api/khassidas', khassidaRoutes);

app.listen(PORT, () => {
    console.log(`Serveur en cours d'éxection sur le port : ${PORT}`);
})

// Optionnel : Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erreur du serveur');
});