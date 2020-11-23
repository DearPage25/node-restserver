const mongoose = require('mongoose');
const validator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

let rolesAcount = {
    values:  ['ADMIM_ROLE', 'USER_ROLE'],
    message: '{VALUE} no es un rol válido'
}


let usuarioSchema = new Schema({
    nombre: {
        type :  String,
        required : [true, 'El nombre es obligatorio']
    },
    email: {
        type : String,
        required : [true,'El correo es obligatorio'],
        unique: true,
    },
    password: {
        type : String,
        required : [true,'La contraseña es obligatoria'],
    },
    img: {
        type : String,
        required: false, 
    },
    role: {
        type : String,
        default: 'USER_ROLE',
        enum: rolesAcount
    },
    estado: {
        type : Boolean,
        default:true
    },
    google: {
        type : Boolean,
        default: false
    }
    
});

usuarioSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(validator, {message: '{PATH} debe ser único'})

module.exports = mongoose.model('Usuario', usuarioSchema);

