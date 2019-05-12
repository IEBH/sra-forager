const axios = require('axios');

/**
 * Europepmc api documentation can be found at https://europepmc.org/RestfulWebService
 */

const BASE_URL = 'https://www.ebi.ac.uk/europepmc/webservices/rest';

const europepmcToSraFields = {
  id: 'pmid',
  pmid: 'pmid',
  pmcid: 'pmcid',
  doi: 'doi',
  title: 'title',
  journalTitle: 'journal',
  pageInfo: 'pages',
  journalVolume: 'volume',
  issue: 'number',
  pubType: 'type',
  pubYear: 'date',
  abstractText: 'abstract',
  authorString: 'authors',
}

/**
 * A databases query fields don't always match its citation fields. This map translates
 * sra fields to the relevant query field, but not the database's citation field.
 */
const sraToEuropepmcQueryFields = {
  pmid: 'ext_id',
  doi: 'doi',
  title: 'title,'
}

/**
 * @param {Object} query
 * @returns {string}
 */
const convertQueryObjectToString = (query) => {
  return Object.keys(query).map(key => `${sraToEuropepmcQueryFields[key]}:${query[key]}`).join(' ')
}

/**
 * @param {Object} europepmcCitation
 * @returns {Object}
 */
const parseEuropepmcCitationToSra = (europepmcCitation) => {
  if (!europepmcCitation) return null;  

  const sraCitation = {};

  Object.keys(europepmcCitation)
    .filter(field => europepmcToSraFields.hasOwnProperty(field))
    .forEach(field => {
      sraCitation[europepmcToSraFields[field]] = europepmcCitation[field];
    })

  if (europepmcCitation.fullTextUrlList) {
    sraCitation.urls = [
      europepmcCitation.fullTextUrlList.fullTextUrl.map(fullTextUrl => fullTextUrl.url),
    ]
  }

  return sraCitation;
}

/**
 * @returns {Object}
 */
const EuropepmcDriver = () => {
  const database = 'europepmc';

  const client = axios.create({
    baseURL: BASE_URL,
  })

  /**
   * Searches scopus, abstracting the extraction of citations from the api response.
   * https://europepmc.org/RestfulWebService#!/Europe32PMC32Articles32RESTful32API/search
   * @param {Object} query
   * @returns {Object[]}
   */
  const search = async ({ query }) => {
    const response = await client.get('/search', {
      params: {
        query: convertQueryObjectToString(query),
        /* Core returns the full document which is particularly useful in foraging. */
        resultType: 'core',
        page: 1,
        /* As we are looking for a single document, we don't need to recurse large collections. */
        pageSize: 25,
        format: 'JSON',
      }
    })
    
    const { resultList: { result: europepmcCitations } } = response.data;
    return europepmcCitations;
  }

  /**
   * Forages a citation by querying scopus with fields in a priority order of
   * specificity.
   * @param {Object} citation
   * @returns {Object} foragedCitation
   */
  const forageCitation = async (citation) => {
    const sraFieldsToQueryInPriorityOrder = ['pmid', 'doi', 'title'];

    for (let field of sraFieldsToQueryInPriorityOrder) {
      if (!citation[field]) continue;

      let europepmcCitations = [];

      try {
        europepmcCitations = await search({ query: { [field]: citation[field] } });
      } catch (error) {
        throw new Error('Something went wrong.');
      }
  
      if (europepmcCitations.length !== 1) continue;

      console.log(`Database ${database}: Successful forage.`);
  
      const parsedSraCitation = parseEuropepmcCitationToSra(europepmcCitations[0]);

      return { ...citation, ...parsedSraCitation };
    }

    console.log(`Database ${database}: Could not find anything.`)

    return citation;
  }

  return {
    database,
    forageCitation,
  }
}

module.exports = EuropepmcDriver;