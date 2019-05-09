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
  const selectedDrivers = options.drivers.map(driver => driversByDatabase[driver.database](driver.config));

  console.log(`Started foraging ${citations.length} citations`);

  const foragedCitations = await Promise.all(citations.map(async (citation, index) => {
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
