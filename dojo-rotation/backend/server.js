// server.js
const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let dojoState = {
  columns: [],
  timer: null,
  isRunning: false,
  currentTime: 120, // 2 minutes in seconds
  currentRound: 0,
};

const path = require("path");

const distributeParticipants = (finishedColumnId) => {
  const finishedColumn = dojoState.columns.find(
    (col) => col.id === finishedColumnId
  );
  if (!finishedColumn) return;

  const participantsToDistribute = finishedColumn.participants;
  const otherColumns = dojoState.columns.filter(
    (col) => col.id !== finishedColumnId
  );

  if (otherColumns.length === 0) return;

  dojoState.columns = otherColumns;

  participantsToDistribute.forEach((participant, index) => {
    const targetColumnIndex = index % otherColumns.length;
    dojoState.columns[targetColumnIndex].participants.push(participant);
  });
};

const rotateActiveParticipants = () => {
  dojoState.columns.forEach((column) => {
    if (column.participants.length > 0) {
      if (column.participants[0].activeRounds >= 3) {
        const movedParticipant = column.participants.shift();
        movedParticipant.activeRounds = 0;
        column.participants.push(movedParticipant);
      }

      column.participants.forEach((p, i) => {
        p.isActive = i === 0;
        if (i === 0) p.activeRounds = (p.activeRounds || 0) + 1;
      });
    }
  });
};

// Socket.io connection
io.on("connection", (socket) => {
  console.log("New client connected");

  socket.emit("state_update", dojoState);

  socket.on("add_column", (column) => {
    column.id = Date.now().toString();
    column.participants = column.participants.map((name) => ({
      name,
      isActive: false,
      activeRounds: 0,
    }));
    dojoState.columns.push(column);
    io.emit("state_update", dojoState);
  });

  socket.on("start_dojo", () => {
    if (dojoState.isRunning) return;

    dojoState.isRunning = true;
    dojoState.currentRound = 0;

    dojoState.columns.forEach((column) => {
      if (column.participants.length > 0) {
        column.participants[0].isActive = true;
        column.participants[0].activeRounds = 1;
      }
    });

    dojoState.timer = setInterval(() => {
      dojoState.currentTime--;

      if (dojoState.currentTime <= 0) {
        dojoState.currentTime = 120; // Reset to 2 minutes
        dojoState.currentRound++;
        rotateActiveParticipants();
      }

      io.emit("state_update", dojoState);
    }, 1000);

    io.emit("state_update", dojoState);
  });

  socket.on("finish_challenge", (columnId) => {
    distributeParticipants(columnId);
    io.emit("state_update", dojoState);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("/dojo", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.get("/leader", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
