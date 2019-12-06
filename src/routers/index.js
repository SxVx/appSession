const { Router } = require('express');
const router = Router();
const passport = require('passport');

const User = require('../models/User');

router.get('/',async (req,res,next)=>{
    
    User.find({},(err,data)=>{
        if(err)throw err;
        res.render('index',{
            data
        });
       
    });
    
});

router.get('/signup',(req,res,next)=>{
    res.render('signup');
});

/*La manera de poder utilizar passport en nuestras rutas es que al momento de 
hacer el post a esta ruta llama el proceso de passport que esta en local-auth
ya que route necesita un callback de respuesta puede ser cualquier callback valido.

passport.authenticate('local-signup') llamamos al procedimiento y
una vez termine hace los redireccionamientos correspondientes
*/
router.post('/signup',passport.authenticate('local-signup',{
    successRedirect : '/profile',
    failureRedirect : '/signup',
    //es para que viva internamente la propiedad en el request, el primer parametro de las funciones router
    passReqToCallback : true,
}));

router.get('/signin',(req,res,next)=>{
    res.render('signin');
});

router.post('/signin',passport.authenticate('local-signin',{
    successRedirect : '/profile',
    failureRedirect : '/signin',
    passReqToCallback : true,
}));



router.get('/profile',isAuthenticated,(req,res,next)=>{
    res.render('profile');
});

router.get('/logout',isAuthenticated,(req,res,next)=>{
    req.user = null;
    req.logout();
    res.redirect('/');
});

function isAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
}


module.exports = router;