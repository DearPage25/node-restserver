const express = require('express');
const app = express();




app.use(require('./usuario-routes.js'));
app.use(require('./login-routes.js'));
app.use(require('./categoria-routes'));
app.use(require('./producto-routes'));
app.use(require('./upload'));
app.use(require('./imagenes-routers'));



module.exports = app;