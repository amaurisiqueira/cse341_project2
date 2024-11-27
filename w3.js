const express = require("express");
const session = require('express-session');
var passport = require("passport");
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

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  cors({
    origin: ["http://localhost", "http://127.0.0.1:5500"],
  })
);

// Configuración de express-session
app.use(session({
  secret: 'clave-secreta-para-sesion',
  resave: false,
  saveUninitialized: true,
}))
//Asegúrate de inicializar Passport y configurar la sesión en tu aplicación Express:
.use(passport.initialize())
.use(passport.session())

.use((req, res, next) => {
  res.setHeader("Access-Controll-Allow-Origin", "*");
  res.setHeader(
     "Access-Control-Allow-Headers",
     "Origin, X-Requested-With, Content-Type, Accept, Z-Key, Authorization"
  );
  res.setHeader(
     "Access-Control-Allow-Methods",
     "POST, GET, PUT, PATCH, OPTIONS, DELETE"
  );
  next();
})
.use(cors({
  methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH']
}))
.use(cors({
  origin: '*'
}));

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACKURL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
   }));
  
// Serializa el usuario para almacenarlo en la sesión
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserializa el usuario desde la sesión
passport.deserializeUser((user, done) => {
  done(null, user);
});


app.get(
  "/auth/github",
  passport.authenticate("github", {   scope: ['read:user','user:email' ],  })
);
/*
app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" ,session:false }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/api-docs"); // Redirecciona a la documentación de Swagger después de un inicio de sesión exitoso
  }
);
*/
app.get("/auth/github/callback", (req, res, next) => {
  console.log("Callback recibido:", req.query); // Verifica si GitHub envía el "code" y "state"
  passport.authenticate("github", { failureRedirect: "/login" })(req, res, next);
}, (req, res) => {
  res.redirect("/api-docs");
});

const authMiddleware = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).json({ error: "No autenticado" });
  }
};

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());
// Middleware para analizar el cuerpo de las solicitudes en formato URL-encoded
app.use(express.urlencoded({ extended: true }));

app.use("/club", authMiddleware, footballClubsRouter);
app.use("/matches", authMiddleware, matchesRouter);

// Middleware para manejar rutas no definidas
app.use((req, res, next) => {
  const error = new Error("Ruta no encontrada");
  error.status = 500;
  next(error);
});

// Middleware para manejar errores
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("");

    // Iniciar el servidor
    const port = process.env.PORT || 8089;
    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  }
});
