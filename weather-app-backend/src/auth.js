const e = require('express');
const jwt = require('jsonwebtoken');
// Define the secret key for signing JWTs
const secret = 'jwt_secret';


/**
 * Middleware function to authenticate a JWT token.
 * 
 * This function checks the Authorization header for a token,
 * verifies it, and attaches the decoded user information to the
 * request object if the token is valid. If the token is missing
 * or invalid, it responds with the appropriate error message.
 * 
 */
const authenticateJWT = (req, res, next) => {
    // Retrieve the Authorization header from the request
    const authHeader = req.headers['authorization'];
    // Extract the token from the header if it exists
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });
  
    // Verify the token using the secret key
    jwt.verify(token, secret, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid token' });
      req.user = user;
      next();
    });
};

module.exports = authenticateJWT;
