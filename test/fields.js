var expect = require('chai').expect;
var Forager = require('..');

describe('Forager.fields()', function() {

	var forager;
	var settings = require('./settings');
	before(()=> forager = new Forager(settings));

	it('should get a list of fields', function(done) {
		forager.fields(function(err, fields) {
			expect(err).to.not.be.ok;
			expect(fields).to.be.an.object;
			expect(fields).to.have.property('doi');
			expect(fields).to.have.property('doiDx');
			expect(fields).to.have.property('google');
			expect(fields).to.have.property('googleScholar');

			if (settings.wos && settings.wos.user && settings.wos.pass) {
				expect(fields).to.have.property('wos');
				expect(fields).to.have.property('wosRelated');
				expect(fields).to.have.property('wosCiting');
			}

			done();
		});
	});

});
