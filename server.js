const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');
const khassidaRoutes = require('./routes/khassidaRoutes');
const traductionRoute = require('./routes/traductionKhassidaRoutes');
const quranRoutes = require('./routes/quranRoutes');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger'); // Importez le fichier de configuration Swagger


const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: ['https://khassidapdf.com', 'http://localhost:4200', 'https://api.khassidapdf.com'], // Spécifiez votre domaine de production
    optionsSuccessStatus: 200,
};

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://www.khassidapdf.com');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(errorHandler);
app.use('/khassida', khassidaRoutes);
app.use('/traduction', traductionRoute);
app.use('/quran', quranRoutes);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port : ${PORT}`);
})


// Optionnel : Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Erreur du serveur');
});

