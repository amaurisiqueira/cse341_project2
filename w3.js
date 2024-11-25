const express = require("express");
const app = express();
const footballClubsRouter = require("./routers/footballClubs");
const matchesRouter = require("./routers/matches");
const cors = require("cors");
const env = require("dotenv");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

env.config();

const mongodb = require("./connections/conection");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(
  cors({
    origin: ["http://localhost", "http://127.0.0.1:5500"],
  })
);

// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());
// Middleware para analizar el cuerpo de las solicitudes en formato URL-encoded
app.use(express.urlencoded({ extended: true }));

 
app.use("/club", footballClubsRouter);
app.use("/matches",  matchesRouter);

process.on("uncaughtException", (err, origin) => {
  // Código para manejar el error
  console.log(process.strerr.fd, ` Caught exception: ${err}`);
});

mongodb.initDb((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("");

    // Iniciar el servidor
    const port = process.env.PORT || 8080;
    app.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  }
});
