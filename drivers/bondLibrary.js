/**
* Return a search link to a search via the Bond University Library
*/
var _ = require('lodash');

module.exports = function(forager) {
	this.populate = function(ref, settings, cb) {
		var refText;

		if (ref.doi) {
			refText = ref.doi;
		} else if (ref.title) {
			refText = ref.title;
		} else if (ref.isbn) {
			refText = ref.isbn;
		} else {
			return cb('No usable fields to search with');
		}

		cb(null,
			'http://apac-tc.hosted.exlibrisgroup.com/primo_library/libweb/action/dlSearch.do?institution=61BON&vid=BOND&tab=default_tab&search_scope=all_resources&mode=Basic&displayMode=full&bulkSize=50&highlight=true&dum=true&query=any%2Ccontains%2C' +
			_.trim(refText.replace('^.+"(.+?)".*', '$1')) +
			'&displayField=all&pcAvailabiltyMode=false&s.cmd=addFacetValueFilters(ContentType%2CNewspaper+Article%2Ct%7CContentType%2CBook+Review%2Ct%7CContentType%2CTrade+Publication%2Ct'
		);
	};

	return this;
};
