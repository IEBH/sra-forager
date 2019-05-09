const axios = require('axios');

const BASE_URL = 'https://api.elsevier.com/content';

const scopusToSraFields = {
  'prism:doi': 'doi',
  'dc:title': 'title',
  'prism:publicationName': 'journal',
  eid: 'eid',
  'pubmed-id': 'pmid',
  'prism:pageRange': 'pages',
  'prism:volume': 'volume',
  'prism:aggregationType': 'type',
  'prism:coverDate': 'date',
  'dc:creator': 'authors',
}

const sraToScopusQueryFields = {
  pmid: 'pmid',
  doi: 'doi',
  title: 'title'
}

/**
 * @param {Object} query
 * @returns {string}
 */
const convertQueryObjectToString = (query) => {
  return Object.keys(query).map(key => `${sraToScopusQueryFields[key]}(${query[key]})`).join(' ')
}

/**
 * @param {Object} scopusCitation
 * @returns {Object}
 */
const parseScopusCitationToSra = (scopusCitation) => {
  if (!scopusCitation) return null;  

  const sraCitation = {};

  Object.keys(scopusCitation)
    .filter(field => scopusToSraFields.hasOwnProperty(field))
    .forEach(field => {
      sraCitation[scopusToSraFields[field]] = scopusCitation[field];
    })

  return sraCitation;
}

/**
 * @param {Object} config
 * @param {string} config.apiKey
 * @returns {Object}
 */
const ScopusDriver = (config) => {
  const database = 'scopus';

  const client = axios.create({
    baseURL: BASE_URL,
    headers: {
      'X-ELS-APIKey': config.apiKey,
    },
  });

  const search = async ({ query }) => {
    const response = await client.get('/search/scopus', {
      params: {
        query: convertQueryObjectToString(query),
        /* Core returns the full document which is particularly useful in foraging. */
        start: 0,
        /* As we are looking for a single document, we don't need to recurse large collections. */
        count: 25,
        httpAccept: 'application/json',
      }
    })

    const results = response.data['search-results'];
  
    if (results['opensearch:totalResults'] === "0") {
      return [];
    }

    const { entry: scopusCitations } = results;    
    return scopusCitations;
  }

  const forageCitation = async (citation) => {
    const sraFieldsToQueryInPriorityOrder = ['pmid', 'doi', 'title'];

    for (let field of sraFieldsToQueryInPriorityOrder) {
      if (!citation[field]) continue;

      let scopusCitations = [];

      try {
        scopusCitations = await search({ query: { [field]: citation[field] } });
      } catch (error) {
        console.log(error);
        throw new Error('Something went wrong.');
      }
  
      if (scopusCitations.length !== 1) continue;

      console.log(`Database ${database}: Successful forage.`);
  
      const parsedSraCitation = parseScopusCitationToSra(scopusCitations[0]);

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

module.exports = ScopusDriver;