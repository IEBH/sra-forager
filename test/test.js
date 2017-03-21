var expect = require('chai').expect;
var Forager = require('..');

describe('Forager.populate()', function() {

	var forager;
	var settings = require('./settings');
	before(()=> forager = new Forager(settings));

	it('should populate a single refernce from a DOI', function(done) {
		this.timeout(10 * 1000);

		forager.populate('10.1016/S0092-8674(00)81683-9', function(err, urls) {
			expect(err).to.not.be.ok;
			expect(urls).to.be.an.object;
			expect(urls).to.have.property('doi', 'https://doi.org/10.1016/S0092-8674(00)81683-9');
			expect(urls).to.have.property('doiDx', 'http://linkinghub.elsevier.com/retrieve/pii/S0092867400816839');

			if (settings.wos && settings.wos.user && settings.wos.pass) {
				expect(urls).to.have.property('wos');
				expect(urls).to.have.property('wosRelated');
				expect(urls).to.have.property('wosCiting');
			}

			done();
		});
	});

});
