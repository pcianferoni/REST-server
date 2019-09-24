const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const User = require('../models/user');
const { verifyToken, verifyAdmin_Role } = require('../middlewares/authentication');
const app = express();

app.get('/user', verifyToken, (req, res) => {

    let from = req.query.from || 0;
    from = Number(from);
    let limit = req.query.limit || 5;
    limit = Number(limit);

    User.find({ state: true }, 'name email role state google img')
        .skip(from)
        .limit(limit)
        .exec((err, User) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            User.count({ state: true }, (err, count) => {
                res.json({
                    ok: true,
                    users,
                    quantity: count
                });
            });
        });


});

app.post('/user', [verifyToken, verifyAdmin_Role], function(req, res) {

    let body = req.body;
    let user = new user({
        name: body.name,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    user.save((err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    });
});

app.put('/user/:id', [verifyToken, verifyAdmin_Role], function(req, res) {

    let id = req.params.id;
    let body = _.pick(req.body, ['name', 'email', 'img', 'role', 'state']);

    User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, userDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            user: userDB
        });
    })
});

app.delete('/user/:id', [verifyToken, verifyAdmin_Role], function(req, res) {

    let id = req.params.id;
    let changeState = {
        state: false
    };
    User.findByIdAndUpdate(id, changeState, { new: true }, (err, deletedUser) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!deletedUser) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'User not found'
                }
            });
        }

        res.json({
            ok: true,
            user: deletedUser
        });
    });
});
module.exports = app;