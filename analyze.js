const fs = require('fs');
const _ = require('underscore');

function load_inventory(file) {
	return new Promise((resolve,reject) => {
		fs.readFile(file,'utf8',(err,raw)=>{
			if (err) throw err;
			try {
				let data = _.chain(raw.split('\n'))
					.map(row => _.object(['product_id','store_id','quantity','price','updated_on'], JSON.parse(row)))
//		 			.tap(console.log)
					.value();
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	});
}

load_inventory('./inventories.csv')
.then(data=>{
	let products_by_store = _.chain(data)
			.groupBy('store_id')
			.value();
			
	let all_stores = _.keys(products_by_store);
	
	/* Returns the product with most quantity at a store */
	//TODO: make this a local maximum, not global, by giving a time frame
	let get_most_stocked = function(store_id) {
		let products = products_by_store[store_id];
		let most_stock = _.max(products, product=>product['quantity']);
		return most_stock;
	}

	let most_stocked = _.chain(all_stores)
	.map(get_most_stocked)
	.value();
	
	most_stocked.map(product => console.log(product['product_id'] + ' @ ' + product['store_id']))
	
	/* Returns the inventory history of a product at a store */
	let get_inventory_history = function (store_id, product_id) {
		let products = products_by_store[store_id];	
		let inventory_history = _.chain(products)
			.filter(product => product['product_id'] === product_id)
//			.map(product => _.pick(product, 'quantity', 'updated_on'))
			.value();

		return inventory_history;
	}

	
	let most_stock_history = _.chain(all_stores)
	                          .map(get_most_stocked)
                              .map(product => get_inventory_history(product['store_id'],product['product_id'])) 
                              .value();
	// console.log(most_stock_history);

	exports.ps = products_by_store;
	exports.ss = all_stores;
	exports._ = _;

	
})

/*
Done - 1. what are the most stocked products at store #?
2. what products were sold yesterday at store #?

*/