const swaggerJsDoc = require('swagger-jsdoc');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Khassida API',
            version: '1.0.0',
            description: 'Documentation de l\'API pour gérer les Khassidas et le Quran',
        },
        servers: [
           /*{
                url: 'http://localhost:3000', // Remplacez par l'URL de votre API en production
                description: 'Serveur local',
            },*/
            {
                url: 'https://api.khassidapdf.com/', // Remplacez par l'URL de votre API en production
                description: 'Serveur de production',
            },
        ],
        components: {
            schemas: {
                Khassida: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Identifiant unique du Khassida',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            description: 'Nom du Khassida',
                            example: 'Alaa Innanii Arjuu'
                        },
                        lienImg: {
                            type: 'string',
                            description: 'URL de l\'image du Khassida',
                            example: 'https://api.khassidapdf.com/image-khassida/alaa-innanii-arjuu.webp'
                        },
                        lienPdf: {
                            type: 'string',
                            description: 'URL du PDF du Khassida',
                            example: 'https://api.khassidapdf.com/khassida-pdf/alaa-innanii-arjuu.pdf'
                        }
                    },
                    required: ['name', 'lienImg', 'lienPdf']
                },
                Quran: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Identifiant unique du Quran',
                            example: 1
                        },
                        name: {
                            type: 'string',
                            description: 'Nom du Quran',
                            example: 'Al-Fatiha'
                        },
                        lienAudio: {
                            type: 'string',
                            description: 'URL de l\'audio du verset du Quran',
                            example: 'https://api.khassidapdf.com/audio/al-fatiha.mp3'
                        },
                        lienPdf: {
                            type: 'string',
                            description: 'URL du PDF du verset du Quran',
                            example: 'https://api.khassidapdf.com/quran-pdf/al-fatiha.pdf'
                        }
                    },
                    required: ['name', 'lienAudio', 'lienPdf']
                }
            }
        }
    },
    apis: ['./controllers/*.js'], // Chemin vers vos fichiers de routes où vous ajouterez des annotations
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
module.exports = swaggerDocs;
