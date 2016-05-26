var express = require('express')
var server = express()

server.use(express.static('public'));

server.listen(8080);