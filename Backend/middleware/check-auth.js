const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //extract the token cuz it came 'Bearer fdsfsdqgdfgq'
        jwt.verify(token, 'secret_this_should_be_longer');
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed" });
    }
};
