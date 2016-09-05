var express = require('express')
var bodyParser = require("body-parser");
var lcbo = require('./codybo.js');
var gm = require('./groupme.js');

var server = express();

server.set('PORT', (process.env.PORT || 5000));


server.use(express.static(__dirname + '/public'));

server.use(bodyParser.json());

server.get("/echo/:text", function(req, res) {
	console.log(req);
	res.send(req.body);
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

server.get("/lcbo-inventory", function(req,res) {
	var geo = (req.query['geo'] != undefined) ? req.query['geo'] : false;
	var pid = (req.query['pid'] != undefined) ? req.query['pid'] : false;

	if (geo && pid && true) {
		lcbo.lookUpInventoryNearAddress(pid, geo)
		.then((json) => res.send(json));
	} else if (pid && true) {
		lcbo.lookUpInventory(pid)
		.then((json) => res.send(json));
	} else {
		console.log('nothing found');
		res.send("[]");
	}
});

server.post("/groupme", function(req,res) {

	console.log(JSON.stringify(req.body));

	/* Save msg to database */
	gm.receiveMessage(req.body);

	/* Dispatch command */
	var cmd = req.body.text.toLowerCase().split(' '); //TODO: dissect command by key words, e.g "find (smirnoff vodka) near (m3n 2a7)" 
	if (cmd[0] == 'find') {
		lcbo.findProduct(cmd[1])
		.then(function(results){
			var txt = results.map(function(p) {
				return p.id + ', ' + p.name + ', $' + p.price_in_cents/100 ;
			}).join('.\n'); //TODO: limit response to 3 records.

			gm.postMessage(txt);
		});
	}; // if cmd = 'find'

	if (cmd[0] == 'near') {
		lcbo.lookUpInventoryNearAddress(cmd[1], cmd[2])
		.then(function(results) {
			var txt = results.map(function(s) {
				return s.name + ', quantity: ' +  s.quantity;
			}).join('.\n'); //TODO: limit response to 3 records.

			gm.postMessage(txt);
		}) 
	} // if cmd = 'near'
});

var port = server.get('PORT');
server.listen(port, function() {
	console.log('codybo is running on port', port);
});

process.on('SIGTERM', function () {
    console.log('SIGTERM - codybo is closeing on port', port);
});
