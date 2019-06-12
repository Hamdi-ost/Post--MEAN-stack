const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; //extract the token cuz it came 'Bearer fdsfsdqgdfgq'
        const decodedToken = jwt.verify(token, 'secret_this_should_be_longer');
        req.userData = { email: decodedToken.email, userId: decodedToken.userId }; // userData actualy does not exist in out request but express allows us to add attribut in the request
        next();
    } catch (error) {
        res.status(401).json({ message: "Auth failed" });
    }
};
