const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const Usuario = require('../models/usuario-models');
const Producto = require('../models/producto-models');
const fs = require('fs');
const path = require('path');
const productoModels = require('../models/producto-models');

app.use(fileUpload({ useTempFiles: true }));

app.put('/upload/:tipo/:id', function (req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No hay seleccionado ningun archivo'
            }
        });
    };
    //Valida tipo

    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
            }
        });
    }



    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];


    //Extenciones permitidas
    let extPermitidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las Extenciones permitidas son ' + extPermitidas.join(', ')
            }
        });
    };
    //Cambiar nombre al archivo

    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;


    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if(tipo === 'usuarios'){

            imagenUsuario(id, res, nombreArchivo);

        } else{
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        console.log(productoDB);
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if(!productoDB) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        };

        borraArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        console.log(productoDB);
        productoDB.save((err, productoGuardado) => {
            if(err) {
                res.status(500).json({
                    ok: false,
                    err
                });

            };
            res.json({
                ok: true,
                producto: productoGuardado,
            })
        })

    });
};

function imagenUsuario(id, res, nombreArchivo) {

    Usuario.findById(id, (err, usuarioDB) => {

        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioDB) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        };


        borraArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;
        usuarioDB.save((err, usuarioGuardado) => {
            if (err) {
                res.status(500).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                usuario: usuarioGuardado,
            });
        });
    });
};



function borraArchivo(nombreImg, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    };
}

module.exports = app;