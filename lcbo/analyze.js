const 
  fs = require('fs'),
  _ = require('underscore'),
  productInfo = require('./data/short_product_info.json');

function load_inventory(file) {
  return new Promise((resolve,reject) => {
    fs.readFile(file,'utf8',(err,raw) => {
      if (err) throw err;
      try {
        let data = _.chain(raw.split('\n'))
          .filter(row => row.length > 1) /* remove empty lines */
          .map(row => _.object(['product_id','store_id','quantity','price','updated_on'], JSON.parse(row)))
          .value();
        resolve(data);
      } catch (e) {
        reject(e);
      }
    });
  });
} // end of load_inventory

function group_products_by_store(data) {
  /* Input: [ {product_id, store_id, quantity, updated_on, ...} ]
   * Output: { 'store_id' : { 'product_id' : [ [ quantity, updated_on ] ] } }
   */
   return data.reduce(function(bin, elm){

     let storeId = elm['store_id'],
          productId = elm['product_id'];

     if (bin[storeId] == undefined)
         bin[storeId] = {};

     if (bin[storeId][productId] == undefined)
         bin[storeId][productId] = [];

     bin[storeId][productId].push([elm['quantity'], elm['updated_on']]);

     return bin;

     }, {});
}

function countSalesRestocks(entries) {
  /*
  * Input: [ [ quantity, updated_on ] ]
  * Output: [ [ -sale1, -sale2 , ... ], [ +restock1, +restock2 ... ] ]
  */
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
  }).value();

  /* add up sales & restocks */
  let sales = stock_diff.reduce((sum,num)=> (num<0) ? (sum+num) : sum , 0);
  let restocks = stock_diff.reduce((sum,num)=> (num>0) ? (sum+num) : sum , 0);
  
  return [sales , restocks];
}

let getProductInfo = _.memoize( id => _.clone(productInfo.filter(p => p['id'] === id) ) );

load_inventory('./inventories.csv')
.then(data=>{

  console.time('products_by_store');

  let products_by_store =  group_products_by_store(data);

  console.timeEnd('products_by_store');

  console.time('sales_by_store');
  let sales_by_store =
  _.chain(products_by_store)
  .map((products_in_store, store) => {

    let sales_restocks =
     _.chain(products_in_store)
      .map( function(entries, product_id) {
        let [sales , restocks] = countSalesRestocks(entries);
        return [product_id, [sales , restocks]];
      }).value();

    return  [store, _.object(sales_restocks)] ;
  }) /* map((products_in_store, store) */
  .object()
  .value(); /* sales_by_store: { 'store' : { 'product' : [sales, restocks]  } } */

  console.timeEnd('sales_by_store');

  let stores = _.keys(sales_by_store);
  let sales_restocks_by_store = stores.map(function(store_id) {
    let products = _.keys(sales_by_store[store_id]);
    let [ sales, restocks] = _.reduce(sales_by_store[store_id],
      function(bin, product){
        bin[0].push(product[0]);
        bin[1].push(product[1]);
        return bin;
      },[[],[]]);
    return [products, sales, restocks ];
  });


  let report = stores.map(store => {
    let store1 = _.indexOf(stores, store);
    let products_store1 = sales_restocks_by_store[store1][0];
    let sales_store1 = sales_restocks_by_store[store1][1];

    let restocks_store1 = sales_restocks_by_store[store1][2];
    let most_restocked = _.max(restocks_store1);
    let most_restocked_id = products_store1[_.indexOf(restocks_store1,most_restocked)];

    let most_sold = _.min(sales_store1);
    let most_sold_id = products_store1[_.indexOf(sales_store1, most_sold)];

    return {store: store,
            most_restocked: most_restocked_id,
            most_restocked_info: JSON.stringify(getProductInfo(most_restocked_id)),
            most_sold: most_sold_id,
            most_sold_info: JSON.stringify(getProductInfo(most_sold_id)),
            most_sold_count: most_sold,
            most_restocked_count: most_restocked};
  });

  console.log(_.groupBy(report,'most_restocked'));


})