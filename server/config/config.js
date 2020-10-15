//==========================
// Puerto
//==========================

process.env.PORT = process.env.PORT || 3000;



//==========================
// Entorno
//==========================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


//===============================
// Fecha de vencimiento del Token
//===============================

process.env.TOKEN_EXP = 60 * 60 * 24 * 30;


//==========================
// Semilla
//==========================

process.env.SEED = process.env.SEED || 'secret-desarrollo';

//==========================
// DataBase
//==========================

let urlDB;


if (process.env.NODE_ENV === 'dev' ) {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;

//==========================
// Google Client ID
//==========================

process.env.CLIENT_ID = process.env.CLIENT_ID || '522295172072-4e1jih04532cevbr4a5nqao0acnddmum.apps.googleusercontent.com';