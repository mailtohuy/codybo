var cors = require('cors')
var express = require('express')
var server = express()

server.use(cors)
server.set('PORT', (process.env.PORT || 5000));


server.use(express.static('public'));

var port = server.get('PORT');
server.listen(port, function() {
	console.log('codybo is running on port', port);
});