/**
* Resolve the DOI and return the completed URL
*/
var _ = require('lodash');
var superagent = require('superagent');

module.exports = function(forager) {
	this.fields = cb => cb(null, ({
		doiDx: 'Find the source article link via DOI.org',
	}));

	this.url = 'http://doi.org/api/handles/';

	this.populate = function(ref, options, callback) {
		if (!ref.doi) return callback('No DOI in reference');

		superagent.get(this.url + ref.doi)
			.end(function(err, res) {
				if (err) return callback(err);
				if (!_.has(res.body, 'values')) return callback('No response recieved');
				var url = res.body.values.find(v => v.type == 'URL');
				if (!url) return callback('No URL found in response');

				callback(null, url.data.value);
			});
	};

	return this;
};
