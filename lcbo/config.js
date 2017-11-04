var access_key = 'MDpkNzE1NTI2ZS0xOWUyLTExZTYtOGVlMi03N2U2MGFjMTAzMjY6QVdzWGpYUFQweW9uejFmRUZjYkNzcVhicE5UWktXQWdna0cz';
var file_base = '.';
module.exports = {
  access_key: access_key,
  product_url: `https://lcboapi.com/products?access_key=${access_key}&per_page=100&store_id=`,
  out_file: `${file_base}/inventories.csv`,
  stores: [ 568, 512, 2, 360, 186, 408, 16, 10, 217, 1, 38, 187, 164, 355, 149, 367, 346 ]
}
