const mongoose = require('mongoose');
const GameSession = require('../models/GameSession');
const Question = require('../models/Question');

let waitingPlayers = [];

const startGame = async (req, res) => {
  const { userId } = req.body;
  const io = req.app.get('io'); // Assuming you've set io on the app object
  try {
    if (waitingPlayers.length > 0) {
      const player1 = waitingPlayers.shift();
      const player2 = userId;
      const questions = await Question.aggregate([{ $sample: { size: 4 } }]);
      const gameSession = new GameSession({
        players: [player1, player2],
        questions: questions.map(q => q._id),
        scores: [
          { playerId: player1, score: 0 },
          { playerId: player2, score: 0 }
        ],
        currentQuestionIndex: 0,
        isActive: true
      });

      await gameSession.save();

      const sanitizedQuestions = questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        choices: q.choices
      }));
      io.to(player1.toString()).emit('game:init', { gameId: gameSession._id, questions: sanitizedQuestions });
      io.to(player2.toString()).emit('game:init', { gameId: gameSession._id, questions: sanitizedQuestions });

      res.status(200).json({ message: 'Game session started', gameId: gameSession._id, questions: sanitizedQuestions });
    } else {
      waitingPlayers.push(userId);
      res.status(200).json({ message: 'Waiting for another player to join' });
    }
  } catch (error) {
    console.error('Error starting game session:', error);
    res.status(500).json({ message: 'Error starting game session', error: error.message });
  }
};

const submitAnswer = async (req, res) => {
  const { gameId, userId, questionIndex, answer } = req.body;
  const io = req.app.get('io');
  try {
    const gameSession = await GameSession.findById(gameId).populate('questions');
    if (!gameSession || !gameSession.isActive) {
      return res.status(400).json({ message: 'Invalid or inactive game session' });
    }

    const question = gameSession.questions[questionIndex];
    const isCorrect = question.correctAnswer === answer;

    const playerScore = gameSession.scores.find(score => score.playerId.toString() === userId);
    if (isCorrect) {
      playerScore.score += 1;
    }

    gameSession.currentQuestionIndex = questionIndex + 1;

    if (gameSession.currentQuestionIndex >= gameSession.questions.length) {
      gameSession.isActive = false;
      const winner = gameSession.scores.reduce((prev, current) => (prev.score > current.score) ? prev : current).playerId;
      gameSession.winner = winner;
      await gameSession.save();

      io.to(gameSession.players[0].toString()).emit('game:end', { winner });
      io.to(gameSession.players[1].toString()).emit('game:end', { winner });

      res.status(200).json({ message: 'Game ended', winner });
    } else {
      await gameSession.save();
      io.to(gameSession.players[0].toString()).emit('question:next', { questionIndex: gameSession.currentQuestionIndex });
      io.to(gameSession.players[1].toString()).emit('question:next', { questionIndex: gameSession.currentQuestionIndex });
      res.status(200).json({ message: 'Answer submitted', isCorrect });
    }
  } catch (error) {
    console.error('Error submitting answer:', error);
    res.status(500).json({ message: 'Error submitting answer', error: error.message });
  }
};

const closeAllSessions = async (req, res) => {
  try {
    await GameSession.updateMany({ isActive: true }, { isActive: false });
    waitingPlayers = []; // Clear waiting players
    res.status(200).json({ message: 'All active sessions closed' });
  } catch (error) {
    console.error('Error closing sessions:', error);
    res.status(500).json({ message: 'Error closing sessions', error: error.message });
  }
};
const setupWebSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('join', ({ userId }) => {
      socket.userId = userId;
      socket.join(userId);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected');
      waitingPlayers = waitingPlayers.filter(id => id !== socket.userId);
    });
  });
};

module.exports = {
  startGame,
  submitAnswer,
  closeAllSessions,
  setupWebSocket
};