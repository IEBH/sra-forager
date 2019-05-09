const EuropepmcDriver = require('./drivers/europepmc');
const ScopusDriver = require('./drivers/scopus');

const driversByDatabase = {
  europepmc: EuropepmcDriver,
  scopus: ScopusDriver,
}

/**
 * @param {Object[]} citations
 * @param {Options} options 
 * @param {Object[]} drivers
 * @param {string} drivers.database
 * @param {Object} drivers.config
 * @returns {Promise<Object[]>}
 */
const forageCitations = async (citations, options) => {
  if (!options.drivers || options.drivers.length === 0) {
    throw new Error('At least driver must be specified.');
  } 

  if (!options.drivers.every(driver => Object.keys(driversByDatabase).includes(driver.database))) {
    throw new Error('Please provide a valid driver.');
  }

  const selectedDrivers = options.drivers.map(driver => driversByDatabase[driver.database](driver.config));

  console.log(`Started foraging ${citations.length} citations`);

  const foragedCitations = await Promise.all(citations.map(async (citation, index) => {
    /* 
    * Delays execution for each citation by its index multiplied by a constant number of ms. This allows spidering per citation 
    * to occur asynchronously but with a sequential offset. 
    * 
    * This is kinder to the databases and avoids rate limiting issues.
    * */    
   await new Promise((resolve) => {
      setTimeout(resolve, index * 1000);
    })

    const foragedCitationByDriver = {};

    await Promise.all(selectedDrivers.map(async driver => {
      try {
        foragedCitationByDriver[driver.database] = await driver.forageCitation(citation);
      } catch (error) {
        /* In the event of an error, save the initial citation without foraging. */
        foragedCitationByDriver[driver.database] = citation;
        console.log(`${driver.database}: Something went wrong.`);
      }
    }))

    return Object.values(foragedCitationByDriver).reduce((a, b) => ({ ...a, ...b }), {});
  }));

  console.log(`Finished foraging`);

  return foragedCitations;
}

const forager = {
  forageCitations,
}

module.exports = forager;
