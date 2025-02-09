const mongoose = require("mongoose");

const GameSessionSchema = new mongoose.Schema({
  players: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  scores: [{ playerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, score: { type: Number, default: 0 } }],
  questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
  currentQuestionIndex: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("GameSession", GameSessionSchema);