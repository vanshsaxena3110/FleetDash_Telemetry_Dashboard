import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(` Socket client connected: ${socket.id}`);

    // Join user or vehicle specific room
    socket.on("join_room", (room) => {
      if (room) {
        socket.join(room);
        console.log(`📡 Socket ${socket.id} joined room: ${room}`);
      }
    });

    socket.on("leave_room", (room) => {
      if (room) {
        socket.leave(room);
        console.log(`📡 Socket ${socket.id} left room: ${room}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`❌ Socket client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};
