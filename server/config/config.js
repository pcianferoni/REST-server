//  Port
process.env.PORT = process.env.PORT || 3000;
//  Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
//  Token Expiration
process.env.CADUCIDAD_TOKEN = '48h';
//  SEED 
process.env.SEED = process.env.SEED || 'seed-dev';
//  DataBase
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

//  Google Client ID
process.env.CLIENT_ID = process.env.CLIENT_ID || '219758474264-vh1bibcphgvbc32km508lubtqkanikf1.apps.googleusercontent.com';