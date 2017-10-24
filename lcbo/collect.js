const https = require('https');
const _ = require('underscore');
const fs = require('fs');

const product_url = 'https://lcboapi.com/products?access_key=MDpkNzE1NTI2ZS0xOWUyLTExZTYtOGVlMi03N2U2MGFjMTAzMjY6QVdzWGpYUFQweW9uejFmRUZjYkNzcVhicE5UWktXQWdna0cz&per_page=50&store_id=';
const file_base = './';
//const out_file = `${file_base}/${(new Date())/1E3|0}.csv`;
const out_file = `${file_base}/inventories.csv`;

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
//                    console.log(`[INFO] got ${data.result.length} records from ${url.slice(url.indexOf('store_id'))}`) ;
                    resolve(data);   
                } catch (e) {
                    console.log(`[ERR] no JSON: ${url.slice(url.indexOf('store_id'))}`);
                    resolve([]);
                }                                 
            });
    
        }).on('error', (err) => {
            console.log(`[ERROR] get: ${url}\n${err}`);
            resolve([]);
        });
});
}

function getAll(base_url) {
    return new Promise((resolve, reject)=>{        
        get(base_url)
        .then((res)=>{
            
            let pages =_.range(res.pager.total_pages) /* NOTE change this to 1 for testing */
                        .map(index => base_url + `&page=${index+1}`)
                        .map(url => get(url));                        
            
            Promise.all(pages)
            .then(all_pages=>{
                let records = all_pages
                              .filter(page => page.result != undefined)  // filter out empty page, i.e. without 'result' section
                              .reduce((a,b)=>a.concat(b.result), []); // extract the 'result' section of each page                      
//                console.log(`[INFO] getAll: ${records.length} records in total`);
                resolve(records); /* Note: 'return' does not work! */
            });
        }) /* get(url).then */
        .catch(err=>reject(err));    
    });
}


function getProductsByStore(storeNumber) {    
    let base_url = product_url + storeNumber;
    
    console.log(`[INFO] getProductsByStore: Fetching from store ${storeNumber}`);
    
    return getAll(base_url)
    .then(products => {
        console.log(`[INFO] getProductsByStore: Store ${storeNumber} has ${products.length} products`);
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
        console.log(`[INFO] saveToFile: ${file_name} done!`);
    });       
}

Promise.all(
    [ 10, 217, 1, 38, 187, 164, 355, 149, 367, 346 ]
    .map(getProductsByStore)
).then(all_products => saveToFile(all_products.reduce((a,b)=>a.concat(b), []), out_file));

/*
 * TODO:
 * 1. Add ability to re-download failed pages
 * 
 * DONE:
 * 1. Filter out empty pages, which are promise rejections in get. DONE
 * 2. Fix async file write: by waiting for all downloading. DONE
 * 3. Fix the merging of products from all stores. DONE
 */