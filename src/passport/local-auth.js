const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const UserSchema = require('../models/User');

/* passport.use('local-signup',new LocalStrategy({},{})) 
    'local-signup' es el nombre de nuestro proceso de autentificacion,es decir así se llama en routes.
    'new Strategy instanciamos la estrategia, recibe por parametro un objeto y un callback una funcion
        el primer parametro (el obejto) es para obtener/identificar los nombres de los inputs del formulario, con cuales
            datos se va a logear el usuario.
        el callback/funcion es para poder hacer uso de la informacion obtenida a traves  de los input del formulario
            la validacion de lo que vamos a almacenar a la base de datos,devolver mensaje al cliente si ocurre un error
            o nos va a devolver a las paginas, AQUI ES DONDE SE REGISTRA EL USUARIO A LA BASE DE DATOS
*/
/* NOTA: passReqToCallback -> nos indica que en la funcion que recibe los datos(el callback que esta a continuacion)
    vamos a poder recibir tambien ademas del email y el password los datos request, es decir los datos adicionalas a
    la hora del registro como direccion,edad,sexo,nacionalidad, etc., quedando la funcion siguiente (req,email,password),
    req hace referencia a esos datos adicionales y guardarlos al mismo tiempo que el email y la contreseña
*/
/* CALLBACK done : este parametro en realidad es un callback es otra funcion es decir que una vez terminemos el proceso de
    autentificacion vamos a utilizar este parametro para terminar o para devolverle una respuesta al cliente
*/

/* 
Entendiendo Passport :
    Una vez que el usuario se autentifica va a terminar el proceso pero
    antes de terminar el proceso nos va a dar los datos del usuario indicado,
    (a traves del <<done>> vamos a serializeUser) de esto datos tan sólo 
    quiero el user.id q es lo que vamos a estar intercambiando entre 
    multiples paginas pero eso va a tener que ser autentificado 
    (a traves del <<done>> vamos a deserializeUser) con el servidor entonces 
    el navegador cada vez que viaja a una nueva pagina me va a dar id y cada vez
    que viaje el usuario vamos a hacer una consulta a la base de datos para ver si
    ese usuario existe, nos va a devolver los datos del usuario y de nuevo se lo damos
    al navegador y este proceso es el que se va a repetir a cada momento cada vez que
    el usuario sea authentificado a traves del primer metodo

    done(error:any,user?:any,IVeryOptions)
*/

passport.use('local-signup',new LocalStrategy({
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true, 
},async(req,email,password,done)=>{

    //Si el usuario ya esta 
    const user = await UserSchema.findOne({email:email});
    if(user){
        /*vamos a terminar la autenticacion y vamos a a decirle, al done 
        null: no ocurrio un error,false: no te vamos a devolver un usaurio,
        y por ultimo vamos a devolver un mensaje*/
        return done(null,false,req.flash('signupMessage','The Email is already taken.'));
    }else{
        const newUser = new UserSchema();
        newUser.email = email; 
        newUser.password = newUser.encryptPassword(password);
        newUser.save();       
        done(null,newUser);
    }
}));

passport.use('local-signin', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true,
}, async (req,email,password,done)=>{
    const user = await UserSchema.findOne({email:email});
    if(!user){
        return done(null,false,req.flash('signinMessage','No User found.'));
    }
    if(!user.comparePassword(password)){
        return done(null,false,req.flash('signinMessage','Incorrect Password'));
    }
    done(null,user);
}));

passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(id,done)=>{
    const user = await UserSchema.findById(id);
    done(null,user);
});