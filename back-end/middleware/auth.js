const jwt = require('jsonwebtoken');
require("dotenv").config();

function auth(req, res, next) {
    try{
        const token = req.cookies.token;

        // Check if token exists
        if (!token){
            return res.status(401).json({ errorMessage: "Unauthorized"});
        };

        // Validate token
        const verified = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        if (!verified){
            return res.status(401).json({ errorMessage: "Unauthorized"});
        }

        req.user = verified.user;
        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({errorMessage: "Unauthorized"});
    }
}

module.exports = auth;