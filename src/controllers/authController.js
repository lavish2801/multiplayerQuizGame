const authService = require('../services/authService');

const authServiceController = {
  registerUser: async (req, res) => {
    try {
      await authService.registerUser(req.body.username, req.body.email, req.body.password);
      res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error registering user", error });
    }
  },

  loginUser: async (req, res) => {
    const { username, password } = req.body;
    try {
      const result = await authService.loginUser(username, password);
      res.status(200).json({
        token: result.token, userId: result.user._id,
        username: result.user.username
      });
    } catch (error) {
      res.status(500).json({ message: "Error logging in", error: error.message });
    }
  },
}

module.exports = authServiceController;