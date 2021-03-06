
//// CREATOR: Odalmi R. Paulino P. 04/10/2020




require('./config/config')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

//connection DB
const configMongo = {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true,
    useFindAndModify: false
}

mongoose.connect(process.env.URLDB, configMongo, (err, res) => {
    if( err ) console.log(err);

    console.log('Base de datos arriba');
});




app.use(bodyParser.urlencoded({ extended: false}))

app.use(bodyParser.json())


//config. routes.
app.use(require('./routes/index-routes'))

//public
app.use(express.static(path.resolve(__dirname, '../public')));
//listen to server PORT
app.listen(process.env.PORT, ()=> {
    console.log('Te escucho en el puerto: ', process.env.PORT);
});
