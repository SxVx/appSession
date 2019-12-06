const { Router } = require('express');
const router = Router();
const passport = require('passport');

const User = require('../models/User');

router.get('/',async (req,res,next)=>{
    User.find({},(err,data)=>{
        if(err)throw err;
        res.send(data);
    });
    //res.render('index');
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
    //es para internamente la propiedad en el request, el primer parametro de las funciones router
    passReqToCallback : true,
}));

router.get('/signin',(req,res,next)=>{
    res.render('signin');
});

router.post('/signin',(req,res,next)=>{
    
});

router.get('/profile',(req,res,next)=>{
    res.render('profile');
});

module.exports = router;