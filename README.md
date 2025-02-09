# multiplayerQuizGame

# Real-Time Quiz Game

A real-time quiz game built with Node.js, MongoDB, and WebSockets. This application allows users to register, log in, and participate in quiz sessions where questions are delivered in real-time. The application will automatically calulate the score for each session and announce the winner.

## Features

- User authentication (registration and login)
- Real-time game session management
- Dynamic question delivery
- Score calculation and winner determination

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- WebSocket
- render 

# Live Preview

Deployed my code on Render. Used mongoDb cloud for ease and high availability.

Base Url:`https://multiplayerquizgame.onrender.com`
This will help to fetch the live preview of user login and play game. 

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/lavish2801/multiplayerQuizGame.git
   ```

2. Navigate to the project directory:
   ```
   cd multiplayerQuizGame
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:
   ```
   MONGODB_URI=<your_mongodb_connection_string>
   JWT_SECRET=<your_jwt_secret>
   PORT:<your_port>
   JWT_KEY=<your_jwt_key>
   NODE_ENV=development
   ```

5. Start the server:
   ```
   npm start
   ```

## API Endpoints

### Re

### Authentication

- **POST /api/auth/register**: Register a new user
- **POST /api/auth/login**: Log in an existing user

### Game Sessions

- **POST /api/game/start**: Start a new game session

### Questions

- **GET /api/questions**: Retrieve a list of questions

## Test User Credentials

----1-----
- **Username**: test
- **Password**: password

----2----
- **Username**: test2
- **Password**: password


# How to Start