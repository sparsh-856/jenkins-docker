const
    http = require("http"),
    express = require("express"),
    socketio = require("socket.io");

const SERVER_PORT = 3000;

let alphaClients = new Map();


function onNewWebsocketConnection(socket) {
    let numberOfAttpemts = 0;
    socket.on('client connected', function(hostname){
      alphaClients.set(hostname,numberOfAttpemts);
      console.log('* node '+ hostname +' had '+numberOfAttpemts+ ' attempt');
    });

    socket.on('attempts',function(hostname,numberOfAttpemts){
      alphaClients.set(hostname,numberOfAttpemts)
      console.log('* node '+ hostname +' had '+numberOfAttpemts+ ' attempt');
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

      server.listen(SERVER_PORT, () => {
        console.info(`Listening on port ${SERVER_PORT}.`)
        console.info('Metrics for ssh log-in attempts')
      });

  }
  
startServer();
