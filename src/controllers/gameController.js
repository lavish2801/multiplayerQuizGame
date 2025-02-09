const mongoose = require('mongoose');
const GameSession = require('../models/GameSession');
const Question = require('../models/Question');

let waitingPlayers = [];

const startGame = async (req, res) => {
 console.log("hello");
};

module.exports = {
  startGame
};