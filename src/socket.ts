import type { Server } from "socket.io";

const registerSocketHandlers = (io: Server) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sync-event", (data) => {
      socket.broadcast.emit("sync-event", data);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("download-finished", ({ videoId }) => {
      console.log("Download finished:", videoId);
    });
  });
};

export default registerSocketHandlers;
