const jwt = require('jsonwebtoken');
require('dotenv').config();

// Decoding JWT Middleware
const decodeJWT = (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  const token = req.headers.authorization.split(' ')[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  //Decoding the token
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken.userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }
  if (decodedToken.exp < Date.now() / 1000) {
    return res.status(401).json({ success: false, message: 'Token expired.' });
  }
  req.userId = decodedToken.userId;
  next();
};

module.exports = { decodeJWT };
