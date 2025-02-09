const GameSession = require('../models/GameSession');

const websocketServer = (io) => {
  const readyPlayers = new Set();

  io.on('connection', (socket) => {
    console.log('New client connected');
  
    socket.on('join', async ({ userId }) => {
      socket.userId = userId;
      socket.join(userId);
      readyPlayers.add(userId);

      if (readyPlayers.size === 2) {
        const players = Array.from(readyPlayers);
        const gameSession = await GameSession.create({ players });
        
        // Emit game:init to both players
        io.to(players[0]).to(players[1]).emit('game:init', {
          gameId: gameSession._id,
          questions: gameSession.questions
        });

        // Clear ready players for the next game
        readyPlayers.clear();
      }
    });
  
    socket.on('question:send', async ({ gameId, questionIndex }) => {
      const gameSession = await GameSession.findById(gameId).populate('questions');
      const question = gameSession.questions[questionIndex];
      socket.emit('question:send', { question });
    });
  
    socket.on('answer:submit', async ({ gameId, userId, questionIndex, answer }) => {
      const gameSession = await GameSession.findById(gameId).populate('questions');
      const question = gameSession.questions[questionIndex];
      const isCorrect = question.correctAnswer === answer;
  
      const playerScore = gameSession.scores.find(score => score.player.toString() === userId);
      if (isCorrect) {
        playerScore.score += 1;
      }
  
      await gameSession.save();
  
      if (questionIndex === gameSession.questions.length - 1) {
        const winner = gameSession.scores.reduce((prev, current) => (prev.score > current.score) ? prev : current).player;
        gameSession.winner = winner;
        await gameSession.save();
  
        io.to(gameSession.players[0].toString()).to(gameSession.players[1].toString()).emit('game:end', { winner });
      } else {
        // Emit next question event
        io.to(gameSession.players[0].toString()).to(gameSession.players[1].toString()).emit('question:next', { questionIndex: questionIndex + 1 });
      }
    });
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
      readyPlayers.delete(socket.userId);
    });
  });
};

module.exports = websocketServer;