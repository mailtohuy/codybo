var rp = require('request-promise');
var apiKey = 'MDpkNzE1NTI2ZS0xOWUyLTExZTYtOGVlMi03N2U2MGFjMTAzMjY6QVdzWGpYUFQweW9uejFmRUZjYkNzcVhicE5UWktXQWdna0cz'


function getJSON(url) {
	return rp(url)
	.then((html) => JSON.parse(html));
}

function sendLcboQuery(endpoint, query) {
	/*
	* Output: [] on failure, [{}] on success
	*/
	var apiKey = 'MDpkNzE1NTI2ZS0xOWUyLTExZTYtOGVlMi03N2U2MGFjMTAzMjY6QVdzWGpYUFQweW9uejFmRUZjYkNzcVhicE5UWktXQWdna0cz';
	var url = 'https://lcboapi.com/' +  endpoint + '?access_key=' + apiKey + '&' + query;

	console.log(`sendLcboQuery: ${url}`);

	return getJSON(url)	
	.then(function(json){
		/* check for error from LCBO API */
		if (json.status != 200) {
			throw new Error(json.status);
		}

		return json.result; //TODO: pager info is lost. Sol: {}
	})
	.catch(function(err) {
		console.error(err);
		return [];
	});
}

module.exports.findProduct = function (query) {
	var q = 'q=' + encodeURIComponent(query);

	return sendLcboQuery('products', q);
}

module.exports.getStoresNearby = function(lat, lon) {
	return sendLcboQuery('stores', `lat=${lat}&lon=${lon}&per_page=10`);
};

module.exports.getStoresNearAddress = function(addr) {
	return sendLcboQuery('stores', `geo=${encodeURIComponent(addr)}&per_page=10`);
}

module.exports.getSalesAtStore = function (storeId) {

	return sendLcboQuery(`stores/${storeId}/products`, 'where=has_limited_time_offer&q=wine&per_page=100')
	.then(function(json){

		/* add results from page 1 */
		var products = json;
		var total_pages = json.pager.total_pages;

		if (total_pages || total_pages == 1) {
			return products;
		}

		/* if more than 1 pages, get all pages */
		// construct page urls
		var pageUrls = []
		for (i = 2; i <= total_pages ; i++) {
			pageUrls.push(url + "&page=" + i);
		}

		// retrieve products from all pages
		return Promise.all(pageUrls.map(getJSON))
		.then(function(jsons) {
			return jsons.reduce(function (x,y) { 
				return {result : (x.result).concat(y.result) };
			});
		})
		.then((a) => products.concat(a.result))
	});
};


