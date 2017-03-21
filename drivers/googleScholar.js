/**
* Return a search link to Google Scholar
*/
module.exports = function(forager) {
	this.fields = cb => cb(null, ({
		googleScholar: 'Search via Google Scholar',
	}));

	this.url = 'https://scholar.google.com/scholar?q=';
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
