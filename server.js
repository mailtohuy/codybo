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

	/* Handle command */
	gm.handle(req.body.text.toLowerCase());

});

process.on('SIGTERM', function () {
    console.log('SIGTERM - codybo is closeing on port', server.get('PORT'));
});


server.listen(server.get('PORT'), function() {
	console.log('codybo is running on port', server.get('PORT'));
});


	/* add handler for 'find pid near geo' */
gm.registerHandler(['find', 'near'], function(pid, geo) {

	return lcbo.lookUpInventoryNearAddress(pid, geo) 
	.then(function(results) { 
		return results.splice(0,5) /* limit response to 5 records */
		.map(store => store.name + ', qty: ' +  store.quantity) /* extract store names and quantities */
		.join('.\n'); 
	})
	.then(txt => gm.postMessage(txt)); /* reply back */

}); // register 'find near'



/* add handler for 'info' */
gm.registerHandler(['info'], function(ignore) {
	gm.postMessage('find <name>: lists products with matching name\nfind <pid> near <address>: nearest stores where product is in stock');
}); // register 'info'



/* add handler for 'find product-name' */
gm.registerHandler(['find'], function(name) {

	return lcbo.findProduct(name)
	.then((results) => {
		results.splice(0,5) /* limit response to 5 records */
		.map(product => `[${product.name}]: id ${product.id}, $ ${product.price_in_cents/100}`)    /* extract product info */
		.join('.\n')
	})
	.then(txt => gm.postMessage(txt)); /* reply back */
}); // register 'find'


