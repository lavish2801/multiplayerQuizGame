const jwt = require('jsonwebtoken');
const Token = require('../models/Token');

const authMiddleware = async (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: "Access denied. No token provided." });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const storedToken = await Token.findOne({ token, userId: decoded.id });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authMiddleware;