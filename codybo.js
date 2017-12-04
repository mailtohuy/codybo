module.exports = {
	'getStoresNearAddress': getStoresNearAddress,
	'getSalesAtStore': getSalesAtStore,
	'getStoresNearby': getStoresNearby,
	'lookUpInventoryNearAddress': lookUpInventoryNearAddress,
	'lookUpInventory': lookUpInventory,
	'findProduct': findProduct
};

const
	rp = require('request-promise'),
	_ = require('lodash'),
	config = require('./codybo-config.json');

const 
	DAY_OF_WEEK =	['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
	DAY_OPENS = DAY_OF_WEEK.map(day => day + '_open'),
	DAY_CLOSES = DAY_OF_WEEK.map(day => day + '_close');

function getJSON(url) {
	return rp(url)
		.then((html) => JSON.parse(html));
}

const sendLcboQuery = _.memoize(__sendLcboQuery, (endpoint, query) => endpoint + '_' + query)

function __sendLcboQuery(endpoint, query) {
	/*
	* Output: [] on failure, [{}] on success
	*/
	var url = 'https://lcboapi.com/' + endpoint + '?access_key=' + config.API_KEY + '&' + query;

	console.log(`sendLcboQuery: ${endpoint} ${query}`);

	return getJSON(url)
		.then(function (json) {
			/* check for error from LCBO API */
			if (json.status != 200) {
				throw new Error(json.status);
			}

			return json.result; //TODO: pager info is lost. Sol: {}
		})
		.catch(function (err) {
			console.error(err);
			return [];
		});
}

function findProduct(query) {
	var q = 'where_not=is_dead&q=' + encodeURIComponent(query);

	return sendLcboQuery('products', q);
}

function lookUpInventory(productId) {
	var q = 'product_id=' + productId;
	return sendLcboQuery('inventories', q);
}

function lookUpInventoryNearAddress(productId, geo) {
	var q = 'product_id=' + productId + '&geo=' + encodeURIComponent(geo); //product_id=272807&geo=m3n+2a7
	return sendLcboQuery('stores', q);
}

function getStoresNearby(lat, lon) {
	return sendLcboQuery('stores', `lat=${lat}&lon=${lon}&per_page=10`);
};

function getStoresNearAddress(addr) {
	return sendLcboQuery('stores', `geo=${encodeURIComponent(addr)}&per_page=10`)
		.then(stores => stores.map(store => {
			process.env.TZ = 'America/Toronto';
			let 
				day = (new Date).getDay(),
				today = DAY_OF_WEEK[day],
				today_open = store[DAY_OPENS[day]] / 60,
				today_close = (store[DAY_CLOSES[day]] / 60) - 12;

			let obj = _.chain(store)
			.pick(config.STORE_FIELDS)
			.defaults({ 
				'address': `${store.address_line_1}, ${store.city}, ${store.postal_code}`,
				'today_hour' : `${today}: ${today_open} am - ${today_close} pm`
			})
			.pick('id', 'name', 'address', 'latitude', 'longitude', 'telephone', 'today_hour')
			.value();
			// console.log(obj);
			debugger;
			return obj;
		}));
			
}

function getSalesAtStore(storeId) {

	return sendLcboQuery(`stores/${storeId}/products`, 'where=has_limited_time_offer&per_page=100')
		.then(function (json) {

			/* add results from page 1 */
			var products = json;
			var total_pages = (json.pager != undefined && json.pager.total_pages != undefined) ? json.pager.total_pages : 1;

			if (total_pages == 1) {
				return products;
			}

			/* if more than 1 pages, get all pages */
			// construct page urls
			var pageUrls = []
			for (i = 2; i <= total_pages; i++) {
				pageUrls.push(url + "&page=" + i);
			}

			// retrieve products from all pages
			return Promise.all(pageUrls.map(getJSON))
				.then(function (jsons) {
					return jsons.reduce(function (x, y) {
						return { result: (x.result).concat(y.result) };
					});
				}).then(all => products.concat(all.result));
		})
		.then(json => {
			let sorted =
			_.chain(json)
				.map(p => _.pick(p, config.PRODUCT_FIELDS))
				.groupBy(p => p.secondary_category)
				.map((g, k) => [k, _.chain(g).sortBy(p => p.price_in_cents).value()])
				.sortBy(([k, v]) => k)
				.map(([k, v]) => v)
				.flatten()
				.filter(p => p.quantity > 0)
				.map(p => {
					p['secondary_category'] = p['secondary_category'].replace(/(\/.*$)/g, '');
					p['price_in_cents'] = p['price_in_cents'] / 100.0;
					p['limited_time_offer_savings_in_cents'] = p['limited_time_offer_savings_in_cents'] / 100.0;

					if (p['alcohol_content']) {
						p['alcohol_content'] = p['alcohol_content'] / 100.0;
						p['name'] = p['name'] + ` (${p['alcohol_content']} %)` ;
					}

					if (!p['image_url']) {
						p['image_url'] = 'https://placeholdit.co//i/100x100?&bg=ffffff&fc=2a2a2a&text=No%20image';
					}

					if (!p['sugar_in_grams_per_liter']) {
						p['sugar_in_grams_per_liter'] = '--';
					}

					return p;
				})
				.value();
			debugger;
			return sorted;
		});
};


