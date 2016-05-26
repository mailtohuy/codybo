var express = require('express')
var server = express()
server.use(express.static(__dirname + '/'));
// server.get('/', function(req,res) {}); 
server.listen(80);