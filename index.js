var _ = require('lodash');
var async = require('async-chainable');
var argy = require('argy');
var debug = require('debug')('forager');

var foragerDefaults = {
	drivers: {
		doi: require('./drivers/doi'),
		doiDx: require('./drivers/doiDx'),
		wos: require('./drivers/wos'),
	},
	wos: { // Put your WoS credentials here if you have any
		user: '',
		pass: '',
	},
};

function Forager(options) {
	var forager = {};
	forager.settings = _.defaults(options, foragerDefaults);

	/**
	* Set an options setting
	* @param {string|Object} setting Either the key to set or an entire object when setting multiple
	* @param {*} [val] The value if setting is a string / single setting to set
	*/
	forager.set = argy('object|string [*]', (setting, val) => {
		if (_.isObject(setting)) {
			_.merge(forager.settings, setting);
		} else {
			forager.settings[setting] = val;
		}
	});


	/**
	* Find all URLS for a given reference
	* The reference should conform to the [RefLib](https://github.com/hash-bang/Reflib) field definitions
	* @param {Object} ref A reference to find links for, if this is an object its assumed it is a valid RefLib reference, if a string its assumed to be a DOI
	* @param {Object} options An optional options object to use in addition to this objects own options + the global defaults
	* @param {function} callback The callback. Will be fired with (err, refURL)
	*/
	forager.populate = argy('object|string [object] function', (rawRef, options, callback) => {
		var ref = _.isString(rawRef) ? {doi: rawRef} : rawRef;

		var settings = _.assign(forager.settings, options);

		async()
			.set('urls', {})
			.forEach(forager.drivers, function(nextDriver, driver, driverID) {
				driver.populate(ref, settings, (err, url) => {
					if (err) {
						debug('Driver', driverID, 'ERR -', err.toString());
					} else if (!url) {
						debug('Driver', driverID, 'recieved empty response');
					} else if (_.isObject(url)) { // Got multiple urls - merge them
						_.assign(this.urls, url);
					} else if (_.isString(url)) {
						this.urls[driverID] = url;
					} else {
						throw new Error('Got URLs back from driver ' + driverID + ' in unknown format: ' + typeof url);
					}
					nextDriver();
				});
			})
			.end(function(err) {
				if (err) return callback(err);
				callback(null, this.urls);
			});
	});


	// Initiate drivers
	forager.drivers = _.mapValues(forager.settings.drivers, (d, id) => new d(forager));

	return forager;
};

module.exports = Forager;
module.exports.defaults = foragerDefaults;
