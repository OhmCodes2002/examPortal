const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // To be restricted in production
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Exam Portal backend is up and running!' });
});

// Real-time proctoring integration points
io.on('connection', (socket) => {
  console.log('User connected for proctoring/live session:', socket.id);
  
  socket.on('proctoring_event', (eventData) => {
    // eventData might look like: { type: 'NO_FACE_DETECTED', timestamp: 12345 }
    console.log(`[Proctoring Flag | ${socket.id}]`, eventData);
    // TODO: Write flag to PostgreSQL via Prisma
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
