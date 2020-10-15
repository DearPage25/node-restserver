const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/usuario-models');
const app = express();

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);

app.post('/login', (req, res) => {
    let body = req.body;

    User.findOne({ email: body.email }, (err, userDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) y/o Contraseña incorrectos'
                }
            });
        };

        if (!bcrypt.compareSync(body.password, userDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario y/o (Contraseña) incorrectos'
                }
            });
        };

        let token = jwt.sign({
            usuario: userDB
        }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });

        res.json({
            ok: true,
            usuario: userDB,
            token
        });
    });

});

// Config Google SignIn
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true,
    }


}

app.post('/google', async (req, res) => {
    let token = req.body.idtoken;
    let googleUser = await verify(token)
        .catch(e => {
            return res.status(403).json({
                ok: false,
                error: e
            });
        });

    User.findOne({ email: googleUser.email }, (err, usuarioDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (usuarioDB) {
            if (usuarioDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Debes usuar SignIn normal'
                    }
                })
            } else {

                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });


                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token

                });

            }
        } else {
            // New user,
            let newUser = new User();

            newUser.nombre = googleUser.name;
            newUser.email = googleUser.email;
            newUser.img = googleUser.img;
            newUser.google = true;
            newUser.password = ':v';

            newUser.save((err, usuarioDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                };
                let token = jwt.sign({
                    usuario: usuarioDB
                }, process.env.SEED, { expiresIn: process.env.TOKEN_EXP });

                return res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token

                });
            })
        }

    })
    // res.json({
    //     token
    // });
});
module.exports = app;

