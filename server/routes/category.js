const express = require('express');

let { verifyToken, verifyAdmin_Role } = require('../middlewares/authentication');
let app = express();
let Category = require('../models/category');
// show all categories
app.get('/category', verifyToken, (req, res) => {

    Category.find({})
        .sort('description')
        .populate('user', 'name email')
        .exec((err, categories) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categories
            });
        })
});
// show category by ID
app.get('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;

    Category.findById(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(500).json({
                ok: false,
                err: {
                    message: 'ID is not valid'
                }
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});
// Create category
app.post('/category', verifyToken, (req, res) => {
    let body = req.body;
    let category = new Category({
        description: body.description,
        user: req.user._id
    });
    category.save((err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});
// Update category
app.put('/category/:id', verifyToken, (req, res) => {

    let id = req.params.id;
    let body = req.body;
    let descCategory = {
        description: body.description
    };
    Category.findByIdAndUpdate(id, descCategory, { new: true, runValidators: true }, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            category: categoryDB
        });
    });
});

// Delete category
app.delete('/category/:id', [verifyToken, verifyAdmin_Role], (req, res) => {
    // only an ADMINROLE can delete categories
    let id = req.params.id;

    Category.findByIdAndRemove(id, (err, categoryDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoryDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID is not valid'
                }
            });
        }

        res.json({
            ok: true,
            message: 'category has been deleted'
        });
    });
});

module.exports = app;