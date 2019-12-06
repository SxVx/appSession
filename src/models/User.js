const mongoose  = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const UserSchema = new Schema({
    email : String,
    password : String
});

UserSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password,bcrypt.genSaltSync(10));
}

UserSchema.methods.comparePassword = function(password){
   return bcrypt.compareSync(password,this.password);
}

module.exports = mongoose.model('users',UserSchema);