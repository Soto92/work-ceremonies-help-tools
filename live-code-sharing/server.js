const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const projectsDir = path.join(__dirname, "shared-projects");

if (!fs.existsSync(projectsDir)) {
  fs.mkdirSync(projectsDir);
}

app.use(express.static(__dirname));
app.use("/shared-projects", express.static(projectsDir));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("loadFile", (filename) => {
    const filePath = path.join(projectsDir, filename);
    fs.readFile(filePath, "utf8", (err, content) => {
      if (err) {
        console.error("Error reading file:", err);
        socket.emit("fileContent", {
          filename,
          content: "// Error loading file",
        });
      } else {
        socket.emit("fileContent", { filename, content });
      }
    });
  });

  socket.on("saveFile", ({ filename, content }) => {
    const filePath = path.join(projectsDir, filename);
    fs.writeFile(filePath, content, "utf8", (err) => {
      if (err) {
        console.error("Error saving file:", err);
        socket.emit("saveError", { filename, error: err.message });
      } else {
        socket.emit("saveSuccess", { filename });
        socket.broadcast.emit("fileContent", { filename, content });
        console.log(`File ${filename} saved and broadcasted.`);
      }
    });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
  console.log(`▶ Access client at http://localhost:${PORT}/client.html`);
});
