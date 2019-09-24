const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const User = require('../models/user');
const Product = require('../models/product');
const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());
app.put('/upload/:tipo/:id', function(req, res) {

    let type = req.params.type;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No file selected'
                }
            });
    }
    // validate type
    let validTypes = ['products', 'users'];
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'valid types are ' + validTypes.join(', ')
            }
        })
    }

    let file = req.files.file;
    let cutName = file.name.split('.');
    let extension = cutName[cutName.length - 1];
    // Allowed extensions
    let validExtensions = ['png', 'jpg', 'gif', 'jpeg'];

    if (validExtensions.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'allowed extensions are ' + validExtensions.join(', '),
                ext: extension
            }
        })
    }
    // rename files
    // 18391-123.jpg
    let fileName = `${ id }-${ new Date().getMilliseconds()  }.${ extension }`;

    file.mv(`uploads/${ type }/${ fileName }`, (err) => {

        if (err)
            return res.status(500).json({
                ok: false,
                err
            });

        // loaded img
        if (type === 'users') {
            imgUser(id, res, fileName);
        } else {
            imgProduct(id, res, fileName);
        }

    });

});

function imgUser(id, res, fileName) {

    User.findById(id, (err, userDB) => {

        if (err) {
            deleteFile(fileName, 'users');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!userDB) {

            deleteFile(fileName, 'users');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User does not exist'
                }
            });
        }

        deleteFile(userDB.img, 'users')

        userDB.img = fileName;

        userDB.save((err, savedUser) => {

            res.json({
                ok: true,
                user: savedUser,
                img: fileName
            });
        });
    });

}

function imgProduct(id, res, fileName) {

    Product.findById(id, (err, productDB) => {

        if (err) {
            deleteFile(fileName, 'products');

            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productDB) {

            deleteFile(fileName, 'products');

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User does not exist'
                }
            });
        }

        deleteFile(productDB.img, 'products')

        productDB.img = fileName;
        productDB.save((err, savedProduct) => {
            res.json({
                ok: true,
                product: savedProduct,
                img: fileName
            });
        });
    });
}

function deleteFile(nameImg, type) {

    let pathImg = path.resolve(__dirname, `../../uploads/${ type }/${ nameImg }`);
    if (fs.existsSync(pathImg)) {
        fs.unlinkSync(pathImg);
    }
}

module.exports = app;