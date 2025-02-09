const Question = require("../models/Question");

const questionService = {
    getQuestions: async (id) => {
        const question = await Question.find();
        return question;
    }
};
module.exports = questionService;