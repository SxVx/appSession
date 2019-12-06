const mongoose = require('mongoose');
const { mongodb } = require('./keys');

mongoose.connect(mongodb.URI,{
    useUnifiedTopology : true,
    useNewUrlParser : true,
    useFindAndModify : false,
})
.then(db => console.log('DB is connected'))
.catch(err => console.log("Error en conexion a base de datos",err) );