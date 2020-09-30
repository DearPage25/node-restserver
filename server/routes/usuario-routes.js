
const express = require('express');
const app = express();
const User = require('../models/usuario-models');
const bcrypt = require('bcrypt');
const _ = require('underscore');

app.get('/usuario', function (req, res) {
    res.json('get Usuario');
});
app.post('/usuario', function (req, res) {
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
app.put('/usuario/:id', function (req, res) {
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
app.delete('/usuario', function (req, res) {
    res.json('delete Usuario');
});


module.exports = app;