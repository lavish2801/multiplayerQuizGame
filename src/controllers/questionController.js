const questionService = require("../services/questionService");

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await questionService.getQuestions();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving questions", error });
  }
};