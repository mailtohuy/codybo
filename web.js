var express = require('express')
var server = express()
//server.use(express.static(__dirname + '/public'));
server.get('/', function(req,res) {
	res.send("Hello!");
});
server.listen(80);