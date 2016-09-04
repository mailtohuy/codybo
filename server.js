var express = require('express')
var bodyParser = require("body-parser");
var lcbo = require('./codybo.js');
var server = express()

server.set('PORT', (process.env.PORT || 5000));


server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json());

server.get("/echo/:text", function(req, res) {
	res.send(req.params.text);
});

server.get("/lcbo/:storeId", function(req,res) {	
	lcbo.getSalesAtStore(req.params.storeId)
	.then((json) => res.send(json));
});

server.get("/lcbo-nearby", function(req,res) {
	var p;
	if (req.query['geo'] != undefined) {
		p = lcbo.getStoresNearAddress(req.query.geo);
	} else {
		p = lcbo.getStoresNearby(req.query.lat,req.query.lon);
	}

	p.then((json) => res.send(json));
});

server.get("/lcbo-product/:name", function(req,res) {	
	lcbo.findProduct(req.params.name)
	.then((json) => res.send(json));
});

server.get("/lcbo-inventory/:productId", function(req,res) {	
	lcbo.lookUpInventory(req.params.productId)
	.then((json) => res.send(json));
});

var port = server.get('PORT');
server.listen(port, function() {
	console.log('codybo is running on port', port);
});