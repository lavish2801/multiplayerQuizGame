const Question = require("../models/Question");

// Get all questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving questions", error });
  }
};

// Add a new question
exports.addQuestion = async (req, res) => {
  const { questionText, choices, correctAnswer } = req.body;

  const newQuestion = new Question({
    questionText,
    choices,
    correctAnswer,
  });

  try {
    const savedQuestion = await newQuestion.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    res.status(500).json({ message: "Error adding question", error });
  }
};