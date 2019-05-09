const EuropepmcDriver = require('./drivers/europepmc');

const driversByDatabase = {
  europepmc: EuropepmcDriver,
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

  const foragedCitations = await Promise.all(citations.map(async citation => {
    const foragedCitationByDriver = {};

    await Promise.all(selectedDrivers.map(async driver => {
      try {
        foragedCitationByDriver[driver.database] = await driver.forageCitation(citation);
      } catch (error) {
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
