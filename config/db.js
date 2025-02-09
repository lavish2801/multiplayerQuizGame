const mongoose = require("mongoose");
mongoose.set('debug', true);
const dotenv = require("dotenv");
const addQuestions = require('../src/scripts/addQuestions');

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
    addQuestions().catch(err => console.error("Error adding questions:", err));
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;