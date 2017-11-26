const 
	express = require('express'),
	rp = require('request-promise'),
	hget = require('hget'),
	bodyParser = require("body-parser"),
	lcbo = require('./codybo.js'),
	_ = require('underscore'),
	gm = require('./groupme.js');

var server = express();

console.log('starting server');

server.set('PORT', (process.env.PORT || 4200));

server.use(express.static(__dirname + '/public'));

server.use(bodyParser.json());

server.get("/p/:encodedUrl", function(req, res) {
	// var url = decodeURIComponent(req.params.encodedUrl);
	var url = new Buffer(req.params.encodedUrl, 'base64').toString('ascii');

	rp(url)
	// .then( html => new Buffer(html).toString('base64'))
	.then( txt => res.send(txt))
	.catch( err => res.send('oops'));
});

server.get("/ep/:encodedUrl", function(req, res) {
	// var url = decodeURIComponent(req.params.encodedUrl);
	var url = new Buffer(req.params.encodedUrl, 'base64').toString('ascii');

	console.time(`El Pais: ${url}`);
	rp(url)
	.then( html => hget(html, {
		markdown: true,
		root: 'article',
		ignore: '.videonoticia,.articulo-tags,.articulo-apoyos,.articulo-extras'
	}))
	.then( md => {
		res.send('<textarea style="margin: 0px; width: 1000px; height: 600px;">' + md + '</textarea>');
		console.timeEnd(`El Pais: ${url}`);
	})
	.catch( err => res.send(err));

});

server.get("/echo/:text", function(req, res) {
	console.log(req);
	res.send(req.body);
});

server.get("/lcbo/:storeId", function(req,res) {
	lcbo.getSalesAtStore(req.params.storeId)
	.then(json => 	res.send(_.chain(json).sortBy(p=>p.secondary_category).value())  );
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

/* add handler for 'find product-name' */
gm.registerHandler(['find'], function(name) {

	return lcbo.findProduct(name)
	.then((results) =>
		results.splice(0,5) /* limit response to 5 records */
		.map(product => `[${product.name}]: id ${product.id}, $ ${product.price_in_cents/100}`)    /* extract product info */
		.join('.\n')
	)
	.then((txt) => gm.postMessage(txt)); /* reply back */
}); // register 'find'


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
