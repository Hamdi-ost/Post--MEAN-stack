const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res, next) => {
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
                        message: 'Invalid authentication credentials!'
                    });
                });
        });
}


exports.userLogin = (req, res, next) => {
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
                process.env.JWT_KEY,
                { expiresIn: '1h' }  //1hour => reason for security
            );
            res.status(200).json({
                token: token,
                expiresIn: "3600", // in second
                userId: fetchedUser._id // we can don't pass this field cuz we already have the userid in the token but it will be heavy to decode the token in the front
            });
        })
        .catch(error => {
            return res.status(401).json({
                message: 'Invalid authentication credatials !'
            });
        })
}
