var os = require("os");
var hostname = os.hostname();
require('dotenv').config()


var AlphaServerHostName;
if(process.env.ALPHASERVER_PROTOCOL && process.env.ALPHASERVER_HOSTNAME && process.env.ALPHASERVER_PORT){
    AlphaServerHostName = process.env.ALPHASERVER_PROTOCOL+"://"+process.env.ALPHASERVER_HOSTNAME+":"+process.env.ALPHASERVER_PORT;
}else{
    AlphaServerHostName = "http://localhost:3000"
}

const 
    io = require ("socket.io-client"),
    socket = io.connect( AlphaServerHostName );

socket.on("connect", () => {
    socket.emit('client connected', hostname);
    const fs = require('fs');
    const TailingReadableStream = require('tailing-stream');
    let numberOfAttpemts = 0;
    const stream = TailingReadableStream.createReadStream("auth.log", {timeout: 0});

    stream.on('data', buffer => {
        file_data = buffer.toString();
        if (file_data.includes('Failed password')){
            numberOfAttpemts = numberOfAttpemts + 1;
        }
        socket.emit('attempts',numberOfAttpemts);

    });
    stream.on('close', () => {
        console.log("close");
    });
});
