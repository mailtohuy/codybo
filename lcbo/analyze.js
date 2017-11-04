const fs = require('fs');
const _ = require('underscore');

function load_inventory(file) {
	return new Promise((resolve,reject) => {
		fs.readFile(file,'utf8',(err,raw)=>{
			if (err) throw err;
			try {
				let data = _.chain(raw.split('\n'))
					.filter(row => row.length > 1) /* remove empty lines */
					// .map(row => _.object(['productId','storeId','quantity','price','updated_on'], JSON.parse(row)))
					.map(row => JSON.parse(row))
//		 			.tap(console.log)
					.value();
				resolve(data);
			} catch (e) {
				reject(e);
			}
		});
	});
} // end of load_inventory

load_inventory('./inventories.csv')
.then(data=>{


	// console.time('groupBy');
	//
	// let products_by_store = _.chain(data)
	// 		.groupBy('storeId')
	// 		.value();
	//
	// console.timeEnd('groupBy');

	console.time('products_by_store');

	let products_by_store = data.reduce((bin, elm) => {
		let storeId = elm[1],
				productId = elm[0],
				quantity = elm[2],
				price = elm[3],
				updated_on = elm[4];

    if (bin[storeId] == undefined) {
        bin[storeId] = {};
    };

    if (bin[storeId][productId] == undefined) {
        bin[storeId][productId] = [];
    };

    bin[storeId][productId].push([quantity, updated_on]);

    return bin;

	}, {}); /* data.reduce: { 'store' : { 'product' : [ [quantity, date] ] } } */

	console.timeEnd('products_by_store');

	console.time('sales_by_store');
	let sales_by_store =
	_.chain(products_by_store)
	.map((products_in_store, store) => {
		let store_ids = [];

		store_ids.push(store);

		let sales_restocks = _.chain(products_in_store)
			.map((entries, product_id) => {

				let stock_diff = [];

				_.chain(entries)
				/* sort by entry date from earliest to latest */
				.sortBy(entry=>entry[1])
				/* extract the quantities, discard the dates */
				.unzip()
				.reduce((first,second)=>first)
				/* calculate difference in stock between each pair of dates */
				.foldr((right, left) => {
					stock_diff.push(right - left);
					return left;
				})
				.value();

				/* add up sales & restocks */
				let sales = stock_diff.reduce((sum,num)=> (num<0) ? (sum+num) : sum , 0);
				let restocks = stock_diff.reduce((sum,num)=> (num>0) ? (sum+num) : sum , 0);

				return [product_id, [sales , restocks]];
			}) /* map((entries, id) */
			.value();

		return  [store, _.object(sales_restocks)] ;
	}) /* map((products, store) */
	.object()
	.value();

	console.timeEnd('sales_by_store');

	console.log(sales_by_store['10']['999979']);

})

/*
Done - 1. what are the most stocked products at store #?
2. what products were sold yesterday at store #?
*/
