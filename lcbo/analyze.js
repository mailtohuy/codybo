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

	console.time('reduce');

	let a = data.reduce((bin, elm) => {
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
		bin[storeId][productId].sort((a,b)=>a[1]>=b[1]);

    return bin;

	}, {}); // data.reduce

	console.timeEnd('reduce');

	// console.log(compareDate);
	console.log(a['568']['999979']);

})

/*
Done - 1. what are the most stocked products at store #?
2. what products were sold yesterday at store #?
*/
