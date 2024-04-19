const socketIO = require("socket.io");
const User = require("../Schema/user.model");
const jwt = require("jsonwebtoken");

const map = new Map();

const socketConnection = (server) => {
  const io = new socketIO.Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {

    const token = socket.handshake.auth.token;
    if (!token) {
      socket.disconnect();
      return;
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET_KEY);
    } catch (error) {
      socket.disconnect();
      return;
    }

    console.log("Socket connected: ", socket.id);

    map.set(socket.id, socket.handshake.query.documentId);

    console.log("this is map", map);

    socket.on("send-changes", (data) => {
      const { documentId, delta } = data;
      for (let [key, value] of map.entries()) {
        if (value === documentId && key !== socket.id) {
          io.to(key).emit("receive-changes", delta);
        }
      }
    });

    socket.on("suggestions", async (data) => {
      const { socketId, username } = data;
      const user = await User.find({
        username: { $regex: username, $options: "i" },
      });
      console.log("this is user", user, socketId);
      io.to(socketId).emit("suggestions", user);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected: ", socket.id);
    });
  });
};

module.exports = { socketConnection };
