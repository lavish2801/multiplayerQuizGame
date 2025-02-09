const Question = require('../models/Question');

const questions = [
  {
    questionText: "What is the capital of India?",
    choices: ["Delhi", "Goa", "Chandigarh", "Jammu"],
    correctAnswer: "Delhi"
  },
  {
    questionText: "What is 2 + 2?",
    choices: ["3", "4", "5", "6"],
    correctAnswer: "4"
  },
  {
    questionText: "When Jumbo started?",
    choices: ["2021", "2008", "2023", "2020"],
    correctAnswer: "2023"
  },
  {
    questionText: "What is the Jumbo office is located?",
    choices: ["Punjab", "Noida", "Delhi", "NA"],
    correctAnswer: "Delhi"
  }
];


async function addQuestions() {
    try {
      const count = await Question.countDocuments();
      if (count === 0) {
        await Question.insertMany(questions);
        console.log("Questions added successfully");
      } else {
        console.log("Questions already exist, skipping insertion");
      }
    } catch (error) {
      console.error("Error adding questions:", error);
    }
  }
  
  module.exports = addQuestions;