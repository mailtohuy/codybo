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
	attachments:  db.Schema.Types.Mixed,
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

module.exports.ChatMessage =  db.model('ChatMessage', messageSchema, 'GroupMe');
