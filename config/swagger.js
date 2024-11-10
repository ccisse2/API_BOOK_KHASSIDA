const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Khassida API',
            version: '1.0.0',
            description: 'Documentation de l\'API Khassida',
        },
        servers: [
            {
                url: 'http://localhost:3000/khassidas/', // Remplacez par l'URL de votre API en production
                description: 'Serveur local',
            },
            {
                url: 'https://api.khassida.com/khassidas/', // Remplacez par l'URL de votre API en production
                description: 'Serveur de production',
            },
        ],
    },
    apis: ['./routes/*.js'], // Chemin vers vos fichiers de routes où vous ajouterez des annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
