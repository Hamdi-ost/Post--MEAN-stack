const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const router = express.Router();

router.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(result => {
                    res.status(201).json({
                        message: "user created",
                        result: result
                    });
                })
                .catch(err => {
                    res.status(500).json({
                        error: err
                    });
                });
        });
});

router.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email })
        .then(user => {
            fetchedUser = user;
            if (!user) {
                return res.status(404).json({
                    message: 'User does not exist'
                });
            }
            return bcrypt.compare(req.body.password, user.password); // compare the hash of both password because the hash can't be reversed(dehashed)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: 'Password incorrect!'
                });
            }
            const token = jwt.sign(
                { email: fetchedUser.email, userId: fetchedUser._id },
                'secret_this_should_be_longer',
                { expiresIn: '1h' }  //1hour => reason for security
            );
            res.status(200).json({
                token: token,
                expiresIn: "3600" // in second
            });
        })
        .catch(error => {

        })
});

module.exports = router;
