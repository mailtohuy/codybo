var db = require('mongoose');

/* schema for El Pais articles */
var newsArticleSchema = new db.Schema({
	url: String, 
	title: String,
	date: { type: Date, default: Date.now },
	body: [String]
});

module.exports.NewsArticle = db.model('NewsArticle', newsArticleSchema, 'elPais');

/* schema for messages from GroupMe */
var messageSchema = new db.Schema({
	text: String,	
	created_at: Number,	
	avatar_url: String,	
	group_id: Number,	
	attachments:  db.Schema.Types.Mixed,
	id: Number,
	name: String,
	sender_id: String,
	sender_type: String,
	source_guid: String,
	system: Boolean,
	user_id: Number
});

module.exports.ChatMessage =  db.model('ChatMessage', messageSchema, 'GroupMe');
