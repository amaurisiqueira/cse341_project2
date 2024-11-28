const passport = require('passport');

const loginRouter = require('express').Router();

// router.use('/', require('./swagger'))
loginRouter.get('/', (req,res) => { res.send( req.session.user!== undefined ? `Logged in as ${req.session.user.username  }` : 'Logged out')} );
/*
    #swagger.tags = ['Login/LogOut']
    #swagger.description = 'Login using github OAUTH 2'
*/
loginRouter.get('/login', passport.authenticate('github'), (req, res) => {});

/*
    #swagger.tags = ['Login/LogOut']
    #swagger.description = 'Logout'
*/
loginRouter.get('/logout', function(req, res, next) {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
});  

// Ruta de autenticación de GitHub
loginRouter.get(
    "/auth/github",
    passport.authenticate("github", { scope: ["read:user", "user:email"] })
  );
  
  // Ruta de callback de GitHub después de la autenticación
loginRouter.get( "/auth/github/callback",  passport.authenticate("github", { failureRedirect: "/login" , session:false}),
    (req, res) => {
      req.session.user = req.user ;
      res.redirect("/api-docs"); // Regresa a Swagger UI tras la autenticación
      //res.redirect("/"); // Regresa a Swagger UI tras la autenticación
    }
  );


module.exports =  loginRouter;