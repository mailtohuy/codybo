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

server.post("/groupme", function(req,res) {

	console.log(JSON.stringify(req.body));

	var db = require('mongoose');
	db.Promise = global.Promise;
	db.connect('mongodb://writer:writer@ds013456.mlab.com:13456/heroku_9lwl8gdd');
	db.connection.on('error', console.error.bind(console, 'connection error!'));
	db.connection.once('open', function() {

		/* Create schema */
		var messageSchema = new db.Schema({
			attachments: [String],
			avatar_url: String,
			created_at: Number,
			group_id: Number,
			id: Number,
			name: String,
			sender_id: String,
			sender_type: String,
			source_guid: String,
			system: Boolean,
			text: String,
			user_id: Number
		});
		
		var ChatMessage = db.model('ChatMessage', messageSchema, 'GroupMe');

		/* Save message to database */
		var message = new ChatMessage(req.body);

		message.save(function (err) {
			if (err) {
				console.error(err);
		  	} 

			/* Close connection */
		  	db.connection.close()
		}); //message.save

	});		
});

var port = server.get('PORT');
server.listen(port, function() {
	console.log('codybo is running on port', port);
});