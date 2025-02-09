require("dotenv").config();
const express = require("express");
const app = express();
const connectDB = require("../config/db");
const authRoutes = require("./routes/authRoutes");
const gameRoutes = require("./routes/gameRoutes");
const questionRoutes = require("./routes/questionRoutes");

connectDB().catch(err => 
    console.error("MongoDB connection error:", err));

app.use(express.json());
app.use(express.static('src/public'));

const server = http.createServer(app);


app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);
app.use("/api/questions", questionRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});