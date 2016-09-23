var img2doc = require('../img2doc.js');

var tool = new img2doc();

tool.save(
	['/Users/huybui/Documents/nodejs/heroku/codybo/public/test/img/img1.png'
	,'/Users/huybui/Documents/nodejs/heroku/codybo/public/test/img/img2.png'
	,'/Users/huybui/Documents/nodejs/heroku/codybo/public/test/img/img3.png'
	,'/Users/huybui/Documents/nodejs/heroku/codybo/public/test/img/img4.png'
	,'/Users/huybui/Documents/nodejs/heroku/codybo/public/test/img/img5.png']
	, '/Users/huybui/Documents/nodejs/heroku/codybo/public/test/rose.docx');