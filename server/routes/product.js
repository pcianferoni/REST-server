const express = require('express');
const { verifyToken } = require('../middlewares/authentication');
let app = express();
let Product = require('../models/product');

//  Get products
app.get('/products', verifyToken, (req, res) => {
    // populate
    // paginated
    let from = req.query.from || 0;
    from = Number(from);
    Product.find({ available: true })
        .skip(from)
        .limit(5)
        .populate('user', 'name email')
        .populate('category', 'description')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            });
        })
});
//  Get product by ID
app.get('/products/:id', (req, res) => {
    // populate
    // paginated
    let id = req.params.id;

    Product.findById(id)
        .populate('user', 'name email')
        .populate('category', 'name')
        .exec((err, productDB) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID does not exist'
                    }
                });
            }

            res.json({
                ok: true,
                product: productDB
            });

        });

});

//  Find products
app.get('/products/buscar/:termino', verifyToken, (req, res) => {

    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Product.find({ name: regex })
        .populate('category', 'name')
        .exec((err, products) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                products
            })
        })
});
//  Create new product
app.post('/products', verifyToken, (req, res) => {
    // write the user
    // write the category

    let body = req.body;
    let product = new Product({
        user: req.user._id,
        name: body.name,
        unitPrice: body.unitPrice,
        description: body.description,
        available: body.available,
        category: body.category
    });
    product.save((err, productDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        res.status(201).json({
            ok: true,
            product: productDB
        });
    });
});
//  Update product
app.put('/products/:id', verifyToken, (req, res) => {
    // write the user
    // write the category
    let id = req.params.id;
    let body = req.body;
    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID does not exist'
                }
            });
        }
        productDB.name = body.name;
        productDB.unitPrice = body.unitPrice;
        productDB.category = body.category;
        productDB.available = body.available;
        productDB.description = body.description;
        productDB.save((err, savedProduct) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: savedProduct
            });
        });
    });
});

//  Delete product
app.delete('/products/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Product.findById(id, (err, productDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!productDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID does not exist'
                }
            });
        }
        productDB.available = false;

        productDB.save((err, deletedProduct) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                product: deletedProduct,
                message: 'product has been deleted'
            });
        })
    })
});

module.exports = app;