import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  console.log("SERVER");
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server, {
      path: "/api/socket",
    });
    res.socket.server.io = io;
    // const httpServer: NetServer = res.socket.server as any;
    // const io = new ServerIO(httpServer, {
    //   path: "/api/socketio",
    // });
    // append SocketIO server to Next.js socket server response
    res.socket.server.io = io;
  }
  res.end();
};

export default SocketHandler;
