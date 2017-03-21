var expect = require('chai').expect;
var Forager = require('..');

describe('Forager.populate()', function() {

	var forager;
	before(()=> forager = new Forager());

	it('should populate a single refernce from a DOI', function(done) {
		forager.populate('10.1016/S0092-8674(00)81683-9', function(err, urls) {
			expect(err).to.not.be.ok;
			expect(urls).to.be.an.object;
			expect(urls).to.deep.equal({
				doi: 'https://doi.org/10.1016/S0092-8674(00)81683-9',
				doiDx: 'http://linkinghub.elsevier.com/retrieve/pii/S0092867400816839',
			});
			done();
		});
	});

});
