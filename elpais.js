var rp = require('request-promise');
var cheerio = require('cheerio');
var models = require('./dbmodels.js');

			// console.log(
			// 	// $('.titulo').length,  
			// 	// $('#titulo').length,
			// 	$('#titulo_noticia').length, // best 
			// 	$('#subtitulo_noticia').length, // best 
			// 	// $('.articulo-titulo').length, 
			// 	// $('.articulo-subtitulo').length,
			// 	// $('.subtitulo').length,	
			// 	// $('#subtitulo').length,
			// 	$('.articulo-titulares').length, // best 
			// 	// $('#cuerpo_noticia').find('p').length, //best
			// 	url
			// 	);
		


function extractTitleList(html) {
	var baseUrl = 'http://elpais.com';
	var $ = cheerio.load(html);	

	var articleUrls = [];

	$('.articulo-titulo').each(function(index){

		var t = $(this).children().first().text();
		var u = $(this).children().first().attr('href');		
		u = u.startsWith('/') ? baseUrl + u : u;

		var article = { url: u, title: t , date: new Date()}; /* this has to match newsArticleSchema */

		articleUrls.push(article);
	});

	return articleUrls;
} // function extractTitleList

function extractArticle(html) {
	var content = [];
	var title = [];
	var body = [];

	var $ = cheerio.load(html);

	if ($('#cuerpo_noticia').length == 0) {
		console.error("Error: #cuerpo_noticia not exists");
		return body;
	}

	var ps = $('#cuerpo_noticia').find('p');

	/* extract content if body has >3 paragraphs */
	if (ps.length < 3) {
		console.error("Error: #cuerpo_noticia has no <p>");
		return body;
	}

	/* extract article body */
	ps.each(function (index) {
		var txt = $(this).text().trim();
		if (txt.length > 1) {
			content.push(txt);	
		}
	}); 

	/* extract article title and subtitle */
	var t = $('#titulo_noticia');
	var s = $('#subtitulo_noticia');
	var ts = $('.articulo-titulares');

	if (t.length) {
		title.push(t.text());
		if (s.length) {
			title.push(s.text().trim());
		}
	} else if (ts.length) {
		title.push(ts.text().trim());
	} else {
		// if no title are found									
	}

	/* add title and content together */
	body = title.concat(content);

	// console.log("==================================================START=======================================================");
	// console.log(body.length);
	// console.log("================================================== END =======================================================");

	return body;
}

function makePromisesFromUrls(urls) {

	return Promise.all(urls.map(
		function(url) {
			// console.log(`${url} | ${Date.now()} | Start downloading`);
			return rp(url)
			.then(function(html) {
				// console.log(`${url} | ${Date.now()} | Finish downloading`);
				return html});
		}
	));
}

function extractAllArticles(articleList) {
	var urls = articleList.map(function(article) {
		return article.url;
	});

	return makePromisesFromUrls(urls)
	.then(function (htmls) {
		// console.log(`Retrieved ${htmls.length} html files`);
		var texts = htmls.map(function(t) {
			return extractArticle(t);
		});
		// console.log(`Extracted ${articles.length} articles`);
		return texts;
	});
}

function saveAll2Db(texts) {
	var db = require('mongoose');
	db.Promise = global.Promise;
	db.connect('mongodb://writer:writer@ds013456.mlab.com:13456/heroku_9lwl8gdd');
	db.connection.on('error', console.error.bind(console, 'connection error!'));
	db.connection.once('open', function() {

		/* Save text to database */
		var allIsSaved = [];

		texts.forEach(function(text) {
			/* skip over empty */
			if (text.length > 0) {
				var article = new models.NewsArticle({body : text});

				var promise = article.save(function (err) {
					if (err) {
						console.error(err);
				  	} 
				}); //article.save

				allIsSaved.push(promise);

			}
		}); // texts.forEach	  

		/* Close connection */
		Promise.all(allIsSaved).then(() => db.connection.close());
	});	
}


function getAllArticlesFromElPais() {
	var articles = [];

	rp('http://elpais.com/elpais/portada_america.html')
	.then(extractTitleList)
	.then(extractAllArticles)
	.then(saveAll2Db)
	.catch(function(err) {
		console.error(err);
	})

} // function getAllArticlesFromElPais

getAllArticlesFromElPais();
