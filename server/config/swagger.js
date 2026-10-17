const swaggerJSDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Placement Platform API Documentation",
      version: "1.0.0",
      description: "Production-grade REST API backend for tracking student preparation paths.",
    },
    servers: [
      {
        url: "https://placement-preparation-platform-x14q.onrender.com/api",
        description: "Production Server (Render)",
      },
      {
        url: "http://localhost:3000/api",
        description: "Local Development Server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token directly or with Bearer prefix",
        },
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accessToken",
          description: "HTTP-only cookie authentication using accessToken or accesstoken",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
      {
        cookieAuth: [],
      },
    ],
  },
  apis: [
    "./routes/*.js",
    "./routes/**/*.js",
    "./server/routes/*.js",
    "./server/routes/**/*.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;