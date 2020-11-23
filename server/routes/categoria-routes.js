const express = require('express');
let { VerificaToken, VerificaRole } = require('../middlewares/authentication');
const _ = require('underscore');
const app = express();
let Categoria = require('../models/cateoria-models');
//==========================
// Mostrar todas las Categ.
//==========================
app.get('/categoria', VerificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                categoriaDB
            });
        });
});

//==========================
// Mostrar una Categ. Por ID
//==========================

app.get('/categoria/:id', VerificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            data: categoriaDB
        })
    })
});

//==========================
// Crear nueva categoria
//==========================

app.post('/categoria', VerificaToken, (req, res) => {

    let body = req.body;
    let usuario = req.usuario._id;


    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario
    });



    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            categoriaDB
        });

    });
});
//==========================
// Actualizar una categoria
//==========================
app.put('/categoria/:id', VerificaToken, (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    Categoria.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            data: categoriaDB

        })
    })
})
//==========================
// Remover una categoria
//==========================

app.delete('/categoria/:id', [VerificaToken, VerificaRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }

        res.json({
            ok: true,
            message: "Categoria Eliminada"

        })
    })
})

module.exports = app;