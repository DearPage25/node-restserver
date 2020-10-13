
const express = require('express');
const app = express();
const User = require('../models/usuario-models');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const {VerificaToken, VerificaRole} = require('../middlewares/authentication')

app.get('/usuario', VerificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);
    
    let limite = req.query.limite || 5;
    limite = Number(limite);


    User.find({estado: true}, 'nombre email role img estado google')
        .skip(desde)
        .limit(limite)
        .exec( (err, usuario) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };

            User.countDocuments({estado: true}, (err, conteo) => {
                res.json({
                    ok: true,
                    usuario,
                    total_register: conteo
                });
            });

            
        })
});
app.post('/usuario', [VerificaToken, VerificaRole],(req, res) => {
    let body = req.body;

    let user = new User({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    user.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuarioDB
        })
    })
});
app.put('/usuario/:id',  [VerificaToken, VerificaRole], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    User.findByIdAndUpdate(id, body, { new: true, runValidators: true,  context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            usuarioDB
        });
    });

});
app.delete('/usuario/:id',  [VerificaToken, VerificaRole], (req, res) => {
    
    let id = req.params.id;

    // User.findByIdAndRemove(id, (err, usuarioBorrado) => {
    User.findByIdAndUpdate(id, {estado: false}, { new: true, context: 'query' }, (err, usuarioDB) => {    
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        // if (!usuarioBorrado) {
        //     return res.status(400).json({
        //         ok: false,
        //         err: {
        //             message: 'Usuario no encontrado'
        //         }
        //     });
        // };

        res.json({
            ok:true,
            usuarioDB
        });

    });
});




module.exports = app;