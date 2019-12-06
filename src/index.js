const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const morgan = require('morgan');
const passport = require('passport');
const session = require('express-session');

// Initializations
const app = express();
require('./database');
require('./passport/local-auth'); // le inidicamos al servidor el uso de passport

// Settings
app.set('views',path.join(__dirname,'views'));
app.engine('ejs',engine);
app.set('view engine','ejs');
app.set('port',process.env.PORT||4200);
const PORT = app.get('port');

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended:false}));
app.use(session({
    secret : 'mysecretsession', //es un seeder para la encriptación de la session
    resave : false, 
    saveUninitialized : false, //false para decirle que no necesitamos tener una especie de inicializacion previa
}));
//passport se necesita ejecutar como un middleware ya que el es el encargado
//de hacer el proceso de validacion interactuando como morgan en las rutas
//Entonces inicializamos passport
app.use(passport.initialize());
/*Ahora como va a escribir un archivo para los datos del usario y lo guarda el "archivo" en
la session asi que por eso necesitamos usar la sesion de express y definirlo antes del uso de este */
app.use(passport.session());

// Routers
app.use(require('./routers/index'));

// Start server
app.listen(PORT,()=>{
    console.log(`Server listen in port ${PORT}`);
});