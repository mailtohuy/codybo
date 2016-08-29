var express = require('express')
var bodyParser = require("body-parser");
var lcbo = require('./codybo.js');
var server = express()

server.set('PORT', (process.env.PORT || 5000));


server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json());

server.get("/echo/:text", function(req, res) {
	res.send(req.params.text);
})

server.get("/lcbo/:storeId", function(req,res) {
	lcbo.getSalesAtStore(req.params.storeId).then((json) => res.send(json));
})

var port = server.get('PORT');
server.listen(port, function() {
	console.log('codybo is running on port', port);
});