import express from 'express';

const server = express();
server.get('/', (req, res) => {
    res.sendFile(__dirname + '/../index.html');
});
//server.use(express.static('public'));
//server.use(express.static(__dirname + '/bower_components'));
//server.use(express.static(__dirname + '/node_modules'));
server.use(express.static(__dirname + '/../assets'));

module.exports = server;
