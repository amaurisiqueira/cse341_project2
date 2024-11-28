const express = require("express");
const session = require("express-session");
const passport = require("passport");
const app = express();
const footballClubsRouter = require("./routers/footballClubs");
const matchesRouter = require("./routers/matches");
const cors = require("cors");
const env = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");
const GitHubStrategy = require("passport-github2").Strategy;
env.config();

const mongodb = require("./connections/conection");

// Swagger documentation route
// app.use("/api -docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// Rutas de Swagger UI
/* delete app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    swaggerOptions: {
      // "http://localhost:8089/auth/github/callback"
      oauth2RedirectUrl: process.env.CALLBACKURL,
      //"http://localhost:8089/api-docs/oauth2-redirect.html", // Asegúrate de usar la URL de callback correcta
      githubAuth: {
        clientId: process.env.GITHUB_CLIENT_ID, //      clientSecret: process.env.GITHUB_CLIENT_SECRET No recomendado exponer, mejor manejarlo en el backend
      },
    },
  })
);
 
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    oauth: {
      clientId: process.env.GITHUB_CLIENT_ID, // Define tu client ID aquí
      clientSecret: "", // No incluyas el client_secret aquí
      scopes: "read:user user:email",
      usePkceWithAuthorizationCodeGrant: true, // Habilita PKCE para mayor seguridad
    },
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
    },
    oauth2RedirectUrl: "http://localhost:8089/api-docs/oauth2-redirect.html", // Ruta de redirección de Swagger
  })
);
// Middleware de CORS
app.use(
  cors({
    origin: ["http://localhost:8089", "http://127.0.0.1:8089"],
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

// Configuración de Passport con GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    function (accessToken, refreshToken, profile, done) {
      console.log("Client Secret:", process.env.GITHUB_CLIENT_SECRET);
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

// Ruta de autenticación de GitHub
app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["read:user", "user:email"] })
);

// Ruta de callback de GitHub después de la autenticación
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    res.redirect("/api-docs"); // Regresa a Swagger UI tras la autenticación
  }
);

// Middleware para proteger rutas (requiere autenticación)
const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(401).json({ error: "No autenticado" });
  }
};

// Middleware para analizar el cuerpo de las solicitudes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas protegidas por autenticación
app.use("/club", authMiddleware, footballClubsRouter);
app.use("/matches", authMiddleware, matchesRouter);

// Middleware para manejar rutas no definidas
app.use((req, res, next) => {
  const error = new Error("Ruta no encontrada");
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
