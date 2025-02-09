const bcrypt = require("bcrypt");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const Token = require('../models/Token');

const authService = {
  registerUser: async (username, email, password) => {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
  },

  loginUser: async (email, password) => {
      if (!password) {
         return res.status(400).json({ message: "Password is required" });
       }
       const user = await User.findOne({ username });
       if (!user) {
         return res.status(404).json({ message: "User not found" });
       }
   
       const isMatch = await bcrypt.compare(password, user.password);
       if (!isMatch) {
         return res.status(401).json({ message: "Invalid credentials" });
       }
   
       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
       const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
       const newToken = new Token({ userId: user._id, token, expiresAt });
       await newToken.save();
       return user;
  },
};

module.exports = authService;