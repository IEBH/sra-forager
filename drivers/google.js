/**
* Return a search link to Google
*/
module.exports = function(forager) {
	this.fields = cb => cb(null, ({
		google: 'Search via Google.com',
	}));

	this.url = 'https://google.com?q=';
	this.populate = function(ref, settings, cb) {
		if (ref.doi) {
			cb(null, this.url + ref.doi);
		} else if (ref.title) {
			cb(null, this.url + ref.title);
		} else if (ref.isbn) {
			cb(null, this.url + ref.isbn);
		} else {
			cb('No usable fields to search with');
		}
	};

	return this;
};
