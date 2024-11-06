const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const khassidaRoutes = require('./routes/khassidaRoutes');
const traductionRoute = require('./routes/traductionKhassidaRoutes');
const quranRoutes = require('./routes/quranRoutes');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: ['https://khassidapdf.com', 'http://localhost:4200', 'https://api.khassidapdf.com'], // Spécifiez votre domaine de production
    optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(errorHandler)

app.use('/api/khassidas', khassidaRoutes);
app.use('/api/khassidas', traductionRoute);
app.use('/api/khassidas', quranRoutes);

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port : ${PORT}`);
})


// Optionnel : Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erreur du serveur');
});

