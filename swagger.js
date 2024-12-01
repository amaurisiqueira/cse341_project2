const swaggerJSDoc = require("swagger-jsdoc");
const path = require("path");
const env = require("dotenv");
env.config();
/*const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CSE341 Project 2",
      version: "0.0.1",
      contact: {
        name: "Amauri Siqueira",
        url: "https://cse341-project1-5jlz.onrender.com",
        email: "siq23002@byui.edu",
      },
    },
    servers: [
      {
        url: "http://localhost:8089",
        description: "Servidor local",
      },
      {
        url: "https://cse341-project1-5jlz.onrender.com",
        description: "Servidor de producción",
      },
    ],
    components: {
      securitySchemes: {
        githubAuth: {
          type: "oauth2",
          
        },
      },
    },
    security: [
      {
        githubAuth: ["read:user", "user:email"],
      },
    ],
  },
  apis: [`${path.join(__dirname, "./routers/*.js")}`],
};
*/

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "CSE341 Project 2",
      version: "0.0.1",
      contact: {
        name: "Amauri Siqueira",
        url: "https://cse341-project1-5jlz.onrender.com",
        email: "siq2585@byui.edu",
      },
    },
    servers: [
      {
        url: process.env.SERVERURL,
        description: "Test Swagger Server",
      },
    ],
    components: {
      securitySchemes: {
        githubAuth: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl: "https://github.com/login/oauth/authorize",
              tokenUrl: "https://github.com/login/oauth/access_token",
              scopes: {
                "read:user": "Access to read user profile information",
                "user:email": "Access to read user email",
              },
            },
          },
        },
      },
    },
    security: [
      {
        githubAuth: [],
      },
    ],
  },
  apis: [`${path.join(__dirname, "./routers/*.js")}`],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
/*
flows: {
            authorizationCode: {
              authorizationUrl: "http://localhost:8089/auth/github",
              tokenUrl: "http://localhost:8089/auth/github/callback",
              scopes: {
                "read:user": "Leer información del usuario",
                "user:email": "Leer correos electrónicos del usuario",
              },
            },
          },
*/
