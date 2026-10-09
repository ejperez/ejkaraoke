import type { Server } from "socket.io";
import type VideoFileManager from "./VideoFileManager.js";

const registerSocketHandlers = (
  io: Server,
  videoFileManager: VideoFileManager,
) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("sync-event", (data) => {
      console.log(data);
      socket.broadcast.emit("sync-event", data);

      switch (data.action) {
        case "request-play-video":
          const video = videoFileManager.getVideo(data.payload.id);

          if (!video) return;

          socket.broadcast.emit("sync-event", {
            action: "play-video",
            payload: { video },
          });
          break;
      }
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
