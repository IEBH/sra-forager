/**
* Return the various links from Web of Science
* This is an incredibly simple driver which really just glues the incomming DOI onto the doi.org URL
*/

var _ = require('lodash');
var superagent = require('superagent');
var xmlParser = require('xml2js');

module.exports = function(forager) {
	this.fields = cb => {
		cb(null, forager.settings.wos && forager.settings.wos.user && forager.settings.wos.pass ? {
			wos: 'Search via Web of Science',
			wosRelated: 'Search for related papers with Web of Science',
			wosCiting: 'Search for cited-by with Web of Science',
		} : null)
	};

	this.url = 'https://ws.isiknowledge.com/cps/xrpc';

	this.populate = function(ref, settings, callback) {
		if (!ref.doi) return callback('No DOI in reference');
		if (!settings.wos || !settings.wos.user || !settings.wos.pass) return callback('No Web of Science connection details specified');

		superagent.post(this.url)
			.send(
				// XML request {{{
				'<?xml version="1.0" encoding="UTF-8" ?>' +
				'<request xmlns="http://www.isinet.com/xrpc42" src="app.id=API Demo">' +
				'	<fn name="LinksAMR.retrieve">' +
				'		<list>' +
				'			<map>' +
				'				<val name="username">' + settings.wos.user + '</val>' +
				'				<val name="password">' + settings.wos.pass + '</val>' +
				'			</map>' +
				'			<map>' +
				'				<list name="WOS">' +
				'					<val>doi</val>' +
				'					<val>sourceURL</val>' +
				'					<val>citingArticlesURL</val>' +
				'					<val>relatedRecordsURL</val>' +
				'				</list>' +
				'			</map>' +
				'			<map>' +
				'				<map name="cite_1">' +
				'					<val name="doi">' + ref.doi + '</val>' +
				/*
				'					<val name="atitle">New kilogram-synthesis of the anti-Alzheimer drug (-)-galanthamine</val>' +
				'					<val name="stitle">TETRAHEDRON LETTERS</val>' +
				'					<val name="vol">39</val>' +
				'					<val name="issue">15</val>' +
				'					<val name="spage">2087</val>' +
				'					<val name="issn">0040-4039</val>' +
				'					<val name="year">1998</val>' +
				'					<list name="authors">' +
				'						<val>Czollner, L</val>' +
				'						<val>Frantsits, W</val>' +
				'						<val>Kuenburg, B</val>' +
				'						<val>Hedenig, U</val>' +
				'						<val>Frohlich, J</val>' +
				'						<val>Jordis, U</val>' +
				'					</list>' +
				*/
				'				</map>' +
				'			</map>' +
				'		</list>' +
				'	</fn>' +
				'</request>'
				// }}}
			)
			.end(function(err, res) {
				if (err) return callback('Error fetching WoS details - ' + err.toString());
				xmlParser.parseString(res.text, (err, parsed) => {
					var path = ['response', 'fn', 0, 'error', 0, '_'];
					if (_.has(parsed, path)) return callback(_.get(parsed, path));

					path = ['response', 'fn', 0, 'map', 0, 'map', 0, 'map', 0, 'val'];
					if (!_.has(parsed, path)) return callback('Invalid response');

					var rawUrls = _(_.get(parsed, path))
						.mapKeys(i => i.$.name)
						.mapValues(i => i._)
						.value()

					var urls = {};
					if (rawUrls.sourceURL) urls.wos = rawUrls.sourceURL;
					if (rawUrls.relatedRecordsURL) urls.wosRelated = rawUrls.relatedRecordsURL;
					if (rawUrls.citingArticlesURL) urls.wosCiting = rawUrls.citingArticlesURL;

					callback(null, urls);
				});
			});
	};

	return this;
};
