const jwt = require('jsonwebtoken');
const config = require("../config/config");


const verifyToken = async (req, res, next) => {
    try {
        const token = req.body.token || req.query.token || req.headers['authorization'];
        if (!token)
            res.status(200).send({ success: false, message: "A token is required for Authentication." });
        jwt.verify(token, config.secret_jwt, (err, decode) => {
            if (err) {
                res.status(400).send("Token is not valid please enter a valid Token");
            }
            req.user = decode;

        });
        
    } catch (error) {
        res.status(400).send("Please Enter token");
    }
    return next();
}
module.exports = verifyToken;