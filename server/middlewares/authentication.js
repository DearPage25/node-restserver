const jwt = require('jsonwebtoken');


//==========================
// Verificador de token
//==========================
let VerificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if ( err ) {
            return res.status(401).json({
                ok: false,
                err:{
                    token: "Token no válido"
                }
            });
        } 

        req.usuario = decoded.usuario;
        
        next();
    });
}

//==========================
// Verificador de ROLE
//==========================

let VerificaRole = (req, res, next) => {
    let usuario = req.usuario;
    if(usuario.role === 'ADMIN_ROLE') {
        next();
    } else {
        return res.json({
            ok: false,
            err: {
                message: `el usuario ${usuario.nombre}: no tiene permisos de Administrador`
            }
        });
    };


}

//==========================
// Verificador de Img
//==========================

let VerificaTokenImg = (req, res, next) => {
    let token = req.query.token;
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        
        if ( err ) {
            return res.status(401).json({
                ok: false,
                err:{
                    token: "Token no válido"
                }
            });
        } 
        req.usuario = decoded.usuario;
        next();
    });
}


module.exports = {VerificaToken, VerificaRole, VerificaTokenImg};