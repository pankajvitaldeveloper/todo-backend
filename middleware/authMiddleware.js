const jwt = require("jsonwebtoken");
const config = require("../config.js");
const User = require("../models/User.js");

// authMiddleware is used to check if the user is authenticated
// if the user is authenticated, the user id is added to the request object
// if the user is not authenticated, the user is not added to the request object
// the request is then passed to the next middleware

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "No authorization header" });
        }

        // Check if the header starts with "Bearer "
        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Invalid token format" });
        }

        // Extract the token by removing "Bearer " prefix
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        const user = await User.findById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        next();
        //above code is used to authenticate the user and add the user id to the request object
        //the user id is then used to find the user in the database
        //the user is then added to the request object
        //the request is then passed to the next middleware
        
    } catch (error) {
        console.error('Auth middleware error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: "Token has expired" });
        }
        return res.status(401).json({ message: "Invalid token" });
    }
};

module.exports = authMiddleware;
