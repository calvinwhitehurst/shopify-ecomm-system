var request = require('request');

module.exports = function getCount(storecred){
    var count = storecred + 'products/count.json';
    request(count, function(err, response, body) {
      const data = JSON.parse(body);
      count = data.count;
    });
    var pagecount = Math.ceil(count / 250);
    return pagecount;
}