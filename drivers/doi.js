/**
* Return the link to the reference in the DOI database
* This is an incredibly simple driver which really just glues the incomming DOI onto the doi.org URL
*/
module.exports = function(forager) {
	this.populate = function(ref, options, callback) {
		if (!ref.doi) return callback('No DOI in reference');
		callback(null, 'https://doi.org/' + ref.doi);
	};

	return this;
};
