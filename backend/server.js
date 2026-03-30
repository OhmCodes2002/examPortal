const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

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

// Secure MVP Execution Endpoint
app.post('/api/execute', (req, res) => {
  const { code, language } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  if (language === 'javascript') {
    const tempFileName = `temp_${crypto.randomBytes(4).toString('hex')}.js`;
    const tempFilePath = path.join(__dirname, tempFileName);
    fs.writeFileSync(tempFilePath, code);

    exec(`node ${tempFilePath}`, { timeout: 3000 }, (error, stdout, stderr) => {
      // Clean up the temp file
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }

      if (error) {
        if (error.killed) return res.json({ error: 'Execution Timed Out (Max 3s)' });
        return res.json({ error: stderr || error.message });
      }
      res.json({ output: stdout });
    });
  } else {
    res.status(400).json({ error: `Language ${language} not supported yet.` });
  }
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
