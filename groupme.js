var rp = require('request-promise');
var mydb = require('./mydb.js');

var botID = '2685810ad4b6e6c28e674d2ce2';

module.exports.receiveMessage = function receiveMessage(msg) {
	var db = require('mongoose');
	db.Promise = global.Promise;
	db.connect('mongodb://writer:writer@ds013456.mlab.com:13456/heroku_9lwl8gdd');
	db.connection.on('error', console.error.bind(console, 'connection error!'));
	db.connection.once('open', function() {
		var message = new mydb.ChatMessage(msg);

		message.save(function (err) {
			if (err) {
				console.error(err);
		  	} 

			/* Close connection */
		  	db.connection.close()
		}); //message.save
	});
}

module.exports.postMessage = function postMessage(msg) {
	var botResp = msg;

	var options = {
		method: 'POST',
	    uri: 'https://api.groupme.com/v3/bots/post',	    
	    body: {
			"bot_id" : botID,		
			"text" : botResp
		},
		json: true
	};

	return rq(options)
		.then( function(body) {
			console.log('groupme - postMessage - sent: ' + botResp + ' to ' + botID);
		})
		.catch( function(err) {
			console.log('groupme - postMessage - error: ', err);
		});
}


