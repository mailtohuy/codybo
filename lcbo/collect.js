const https = require('https');
const _ = require('underscore');
const fs = require('fs');
const config = require('./config.js');

const access_key = config.access_key;
const product_url = config.product_url;
const out_file = config.out_file;
const store_list = config.stores;

function get(url) {
    return new Promise((resolve, reject)=>{
        https.get(url, (res)=> {
            res.setEncoding('utf8');
            let rawData = '';
            res.on('data', (chunk) => { rawData += chunk; });
            res.on('end', () => {
                try {
                    let data;
                    data = JSON.parse(rawData);
                  //  console.debug(`[INFO] got ${data.result.length} records from ${url.slice(url.indexOf('store_id'))}`) ;
                    resolve(data);
                } catch (e) {
                    // console.error(`[ERR] no JSON: ${url.slice(url.indexOf('store_id'))}`);
                    resolve([]);
                }
            });

        }).on('error', (err) => {
            // console.error(`[ERROR] get: ${url}\n${err}`);
            resolve([]);
        });
});
}

function getAll(base_url) {
    return new Promise((resolve, reject)=>{
        get(base_url)
        .then((res)=>{

            // console.time(`${base_url.slice(base_url.indexOf('store_id'))}`);

            let pageRequests =_.range(res.pager.total_pages) /* NOTE change this to 1 for testing */
                        .map(index => base_url + `&page=${index+1}`)
                        .map(url => () => get(url));

            pageRequests.reduce((all_pages, request)=>request().then(Array.prototype.concat.bind(all_pages)) ,Promise.resolve([]))
            .then(all_pages=>{
                let records = all_pages
                              .filter(page => page.result != undefined)  // filter out empty page, i.e. without 'result' section
                              .reduce((a,b)=>a.concat(b.result), []); // extract the 'result' section of each page
//                console.log(`[INFO] getAll: ${records.length} records in total`);
                // console.timeEnd(`${base_url.slice(base_url.indexOf('store_id'))}`);
                resolve(records); /* Note: 'return' does not work! */
            });

//             let pages =_.range(res.pager.total_pages) /* NOTE change this to 1 for testing */
//                         .map(index => base_url + `&page=${index+1}`)
//                         .map(url => get(url));
//
//             Promise.all(pages)
//             .then(all_pages=>{
//                 let records = all_pages
//                               .filter(page => page.result != undefined)  // filter out empty page, i.e. without 'result' section
//                               .reduce((a,b)=>a.concat(b.result), []); // extract the 'result' section of each page
// //                console.log(`[INFO] getAll: ${records.length} records in total`);
//                 // console.timeEnd(`${base_url.slice(base_url.indexOf('store_id'))}`);
//                 resolve(records); /* Note: 'return' does not work! */
//             });
        }) /* get(url).then */
        .catch(err=>reject(err));
    });
}


function getProductsByStore(storeNumber) {
    let base_url = product_url + storeNumber;

    // console.info(`[INFO] getProductsByStore: Fetching from store ${storeNumber}`);

    return getAll(base_url)
    .then(products => {
        console.info(`[INFO] getProductsByStore: Store ${storeNumber} has ${products.length} products`);
        var content = _.chain(products)
                       .map(product => _.chain(product)
                                 .defaults({ 'store_id': storeNumber })  /* add store number */
                                 .pick('id', 'store_id', 'quantity', 'price_in_cents', 'updated_on') /* arrange in this order */
                                 .values() /* convert object to array */
                                 .value())
                        .value();
        return content;
    }); /* getAll */
}

function saveToFile(content, file_name) {
    let data = '\n' + content
              .map(row=>JSON.stringify(row))
              .join('\n');

    fs.appendFile(file_name, data, 'utf8', (err) => {
        if (err) throw err;
        // console.info(`[INFO] saveToFile: ${file_name} done!`);
    });
}


store_list.map(store => () => getProductsByStore(store))
.reduce((all_products, getProducts) => getProducts().then(Array.prototype.concat.bind(all_products)), Promise.resolve([]))
.then(all_products => saveToFile(all_products.reduce((a,b)=>a.concat(b), []), out_file));

/*
 * TODO:
 * 1. Add ability to re-download failed pages
 *
 * DONE:
 * 1. Filter out empty pages, which are promise rejections in get. DONE
 * 2. Fix async file write: by waiting for all downloading. DONE
 * 3. Fix the merging of products from all stores. DONE
 */
