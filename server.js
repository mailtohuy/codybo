var express = require('express')
var server = express()

server.set('PORT', (process.env.PORT || 5000));


server.use(express.static('public'));

var port = server.get('PORT');
server.listen(port);