const express = require('express');
const { VerificaToken, VerificaRole } = require('../middlewares/authentication');
let app = express();
const _ = require('underscore');
const Producto = require('../models/producto-models.js');


app.get('/productos', VerificaToken, (req, res) => {
    //trae todos los productos
    //populate: usuario categoria
    //paginado
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);
    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    err
                });
            };
            res.json({
                ok: true,
                data: productoDB
            });
        });

});


app.get('/productos/:id', VerificaToken, (req, res) => {
    //populate: usuario categoria
    const { id } = req.params;

    Producto.findById(id, { disponible: true }, (err, productoDB) => {
        if (err) {

            return res.status(400).json({
                ok: false,
                err
            });

        };
        res.json({
            ok: true,
            data: productoDB
        });
    })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion');


});

app.get('/productos/buscar/:termino', VerificaToken, (req, res) => {
    let { termino } = req.params;
    let regexp = new RegExp(termino, 'i');

    Producto.find({nombre:  regexp})
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    err
                });
            };
            res.json({
                ok: true,
                data: productoDB
            });
        })
});

app.post('/productos/', VerificaToken, (req, res) => {
    //grabar el usuario
    //grabar una categoria del listado

    const { nombre, precioUni, descripcion, disponible, categoria } = req.body;
    let usuario = req.usuario._id;

    let producto = new Producto({
        nombre,
        precioUni,
        descripcion,
        disponible,
        categoria,
        usuario

    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            productoDB
        });
    })
});

app.put('/productos/:id', VerificaToken, (req, res) => {
    // grabar el usuario
    //grabar una categoria del listado

    const { id } = req.params;
    let body = req.body;

    Producto.findById(id, (err, productoDB) => {

        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'El ID no existe'
                }
            });
        };

        productoDB.nombre = body.nombre;
        productoDB.precioUni = body.precioUni;
        productoDB.categoria = body.categoria;
        productoDB.disponible = body.disponible;
        productoDB.descripcion = body.descripcion;
        productoDB.usuario = req.usuario._id;
        productoDB.save((err, productoSave) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            };
            res.json({
                ok: true,
                producto: productoSave
            });
        });

    });


});

////////////////
app.delete('/productos/:id', VerificaToken, (req, res) => {

    const { id } = req.params;

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: true,
                err
            });
        };
        if (!productoDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'El ID no existe'
                }
            });
        };

        productoDB.disponible = false;
        productoDB.save((err, productoSave) => {
            if (err) {
                return res.status(500).json({
                    ok: true,
                    err
                });
            };
            res.json({
                ok: true,
                message: 'El  producto fue eliminado'
            });
        });

    });

});

module.exports = app;