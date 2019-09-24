const express = require('express');
const fs = require('fs');
const path = require('path');
const { verifyTokenImg } = require('../middlewares/authentication');
let app = express();

app.get('/imagen/:tipo/:img', verifyTokenImg, (req, res) => {

    let type = req.params.type;
    let img = req.params.img;
    let pathImagen = path.resolve(__dirname, `../../uploads/${ type }/${ img }`);
    if (fs.existsSync(pathImagen)) {
        res.sendFile(pathImagen);
    } else {
        let noImagePath = path.resolve(__dirname, '../assets/no-image.jpg');
        res.sendFile(noImagePath);
    }
});

module.exports = app;