var io = require('socket.io-client')
require("mocha");
var os = require("os");
var hostname = os.hostname();
describe('Alpha Server Client app unit tests', function() {

    var socket;
    beforeEach(function(done) {
        // Setup
        socket = io.connect('http://localhost:3000', {
            'reconnection delay' : 0
            , 'reopen delay' : 0
            , 'force new connection' : true
        });
        socket.on('connect', function() {
            console.log('Connected')
            done();
        });
        socket.on('disconnect', function() {
        })
    });

    afterEach(function(done) {
        // Cleanup
        if(socket.connected) {
            socket.disconnect();
            console.log('Disconnected')
        } else {
            // There will not be a connection unless you have done() in beforeEach, socket.on('connect'...)
            console.log('no connection to break...');
        }
        done();
    });  

    describe('connect to server using socket.io-client', function() {

        it('validate connection', function(done) {
            done();
        });

        it('Emit client connected event', function(done) {
            socket.emit('client connected', hostname)
            done();
        });
        it('Emit client connected and Emit attempts event', function(done) {
            socket.emit('client connected', hostname)
            socket.emit('attempts', hostname,0)
            done();
        });
        it('Emit number of attempts as 1', function(done) {
            socket.emit('attempts', hostname,1)
            done();
        });

    });

});