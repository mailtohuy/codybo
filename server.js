var express = require('express')
var bodyParser = require("body-parser");
var server = express()

server.set('PORT', (process.env.PORT || 5000));


server.use(express.static(__dirname + '/public'));
server.use(bodyParser.json());

/*  "/contacts"
 *    GET: finds all contacts
 *    POST: creates a new contact
 */

server.get("/news/list", function(req, res) {
	res.send('Hello World!');
});

server.get("/echo/:text", function(req, res) {
	res.send(text);
})

var port = server.get('PORT');
server.listen(port, function() {
	console.log('codybo is running on port', port);
});