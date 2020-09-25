var request = require('request');

module.exports = function fetchJSON(url) {
	return new Promise((resolve, reject) => {
	  request(url, function(err, res, body) {
		if (err) {
		  reject(err);
		} else if (res.statusCode !== 200) {
		  reject(new Error('Failed with status code ' + res.statusCode));
		} else {
		  resolve(JSON.parse(body));
		}
	  });
	});
  }