const 
    io = require ("socket.io-client"),
    socket = io.connect("http://alphasolution_alphaserver_1:3000");

const fs = require('fs');
const TailingReadableStream = require('tailing-stream');

const stream = TailingReadableStream.createReadStream("auth.log", {timeout: 0});

stream.on('data', buffer => {
    console.log(buffer.toString());
});
stream.on('close', () => {
    console.log("close");
});
