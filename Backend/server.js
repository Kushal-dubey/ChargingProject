//  Core imports
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

//  Load environment variables
dotenv.config();

//  Import DB connection
const connectDB = require('./config/db');

//  Import Routes
const authRoutes = require('./routes/auth'); // For login/signup
const stationRoutes = require('./routes/station'); // For station CRUD

//  Debug Line (optional, can remove later)
console.log("MONGO_URI:", process.env.MONGO_URI);

// Connect to MongoDB
connectDB();
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // your frontend
    methods: ["GET", "POST", "PUT", "DELETE"]
  },
});

app.set("socketio", io);

io.on("connection", (socket) => {
  console.log("🟢 Socket connected:", socket.id);
});



//  Middleware
app.use(cors());
app.use(express.json()); // for parsing JSON requests

//  Route Middleware
app.use('/api/auth', authRoutes);         // e.g., /api/auth/login, /api/auth/signup
app.use('/api/stations', stationRoutes);  // e.g., /api/stations/ POST, GET etc.

//  Test Route
app.get('/', (req, res) => {
  res.send('⚡ Charger Backend API is working!');
});

//  Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});

