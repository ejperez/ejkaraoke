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
        case "request-add-to-queue":
          const video = videoFileManager.getVideo(data.payload.video.id);

          if (!video) return;

          socket.broadcast.emit("sync-event", {
            action: "add-to-queue",
            payload: { video: { ...data.payload.video, ...video } },
          });
          break;
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });

    socket.on("download-finished", ({ id }) => {
      console.log("Download finished:", id);
    });
  });
};

export default registerSocketHandlers;
