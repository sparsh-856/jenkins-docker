const
    http = require("http"),
    express = require("express"),
    socketio = require("socket.io");

const SERVER_PORT = 3000;

let alphaClients = new Set();


function onNewWebsocketConnection(socket) {
    console.info(`Socket ${socket.id} has connected.`);
    alphaClients.add(socket.id);

    socket.on("disconnect", () => {
      alphaClients.delete(socket.id);
        console.info(`Socket ${socket.id} has disconnected.`);
    });

  }

  function startServer() {
      // create a new express app
      const app = express();
      // create http server and wrap the express app
      const server = http.createServer(app);
      // bind socket.io to that server
      const io = socketio(server);
  
      // will fire for every new websocket connection
      io.on("connection", onNewWebsocketConnection);

      server.listen(SERVER_PORT, () => console.info(`Listening on port ${SERVER_PORT}.`));

  }
  
startServer();
