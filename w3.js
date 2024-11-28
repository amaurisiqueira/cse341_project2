const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const footballClubsRouter = require("./routers/footballClubs");
const matchesRouter = require("./routers/matches");
const loginRouter = require("./routers/index");
const cors = require("cors");
const env = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const authMiddleware = require('./utils/checkAuth');

const GitHubStrategy = require("passport-github2").Strategy;
env.config();

const mongodb = require("./connections/conection");
//const bodyParser = require("body-parser");

/*
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    oauth: {
      clientId: process.env.GITHUB_CLIENT_ID, // Solo necesitas el clientId
      scopes: "read:user user:email",
      usePkceWithAuthorizationCodeGrant: true, // Habilita PKCE
    },
    oauth2RedirectUrl: "http://localhost:8089/api-docs/oauth2-redirect.html", // Ruta de redirección de Swagger
  })
);
*/

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    oauth: {
      clientId: process.env.GITHUB_CLIENT_ID, // Solo necesitas el clientId
      scopes: "read:user user:email",
      usePkceWithAuthorizationCodeGrant: true, // Habilita PKCE
    }
  })
);
// Middleware para cabeceras de CORS (si es necesario, podría eliminarse por la configuración de CORS anterior)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "POST, GET, PUT, PATCH, OPTIONS, DELETE"
  );
  next();
});

// Middleware de CORS
app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware de express-session
app.use(
  session({
    secret: "clave-secreta-para-sesion",
    resave: false,
    saveUninitialized: true,
  })
);

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());


// Configuración de Passport con GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    function (accessToken, refreshToken, profile, done) {
      //    console.log("Client Secret:", process.env.GITHUB_CLIENT_SECRET);
      return done(null, profile);
    }
  )
);

// Serializa el usuario para almacenarlo en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializa el usuario desde la sesión
passport.deserializeUser((user, done) => {
  done(null, user);
});





// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas protegidas por autenticación
//be login out of restriction of autentication
app.use("/", loginRouter);
app.use("/club", authMiddleware, footballClubsRouter);
app.use("/matches", authMiddleware, matchesRouter);



// Middleware para manejar rutas no definidas
app.use((req, res, next) => {
  const error = new Error("Unknown route!");
  error.status = 404;
  next(error);
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  res.status(error.status || 500).json({
    error: {
      message: error.message,
    },
  });
});




    


// Conexión a MongoDB y arranque del servidor
mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    const port = process.env.PORT || 8089;
    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  }
});
