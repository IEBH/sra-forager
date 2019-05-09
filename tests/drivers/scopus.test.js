const chai = require('chai');
const ScopusDriver = require('../../drivers/scopus');
const config = require('../config');

const { expect } = chai;

describe('scopus: forageCitation', () => {
  const scopusDriver = ScopusDriver(config.drivers.scopus);

  it('should return the original citation if no fields are available to query.', async () => {
    const citation = { pages: 'b3410' };
    try {
      const foragedCitation = await scopusDriver.forageCitation(citation);
      expect(foragedCitation).to.deep.equal(citation);
    } catch (error) {
      expect(error).to.be.not.ok;
    }
  })

  it('should aggregate fields when a citation has been successfully found.', async () => {
    const citation = { pmid: '19826172' };
    try {
      const foragedCitation = await scopusDriver.forageCitation(citation);
      expect(foragedCitation).to.have.own.property('pmid');
      expect(foragedCitation).to.have.own.property('eid');
      expect(foragedCitation).to.have.own.property('title');
      expect(foragedCitation).to.have.own.property('authors');
      expect(foragedCitation).to.have.own.property('journal');
      expect(foragedCitation).to.have.own.property('volume');
      expect(foragedCitation).to.have.own.property('pages');
      expect(foragedCitation).to.have.own.property('date');
      expect(foragedCitation).to.have.own.property('doi');
      expect(foragedCitation).to.have.own.property('type');
    } catch (error) {
      expect(error).to.be.not.ok;
    }
  })
})