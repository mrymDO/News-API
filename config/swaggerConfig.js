import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Tech News',
      version: '1.0.0',
      description: 'API documentation using Swagger',
    },
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'Authorization',
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
