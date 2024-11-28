
// Middleware para proteger rutas (requiere autenticación)
const authMiddleware = (req, res, next) => {

    if (req.session.user === undefined){
      return res.status(401).json("You do not have access");
    } 
    return next();
    
  };


  module.exports = authMiddleware;