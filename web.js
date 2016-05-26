var express = require('express')
var server = express()

app.set('PORT', (process.env.PORT || 5000));


server.use(express.static('public'));

var port = app.get('PORT');
server.listen(port);