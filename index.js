const driversByDatabase = {

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

  const aggregatedCitations = await Promise.all(citations.map(async citation => {
    const aggregatedCitationByDriver = {};

    await Promise.all(selectedDrivers.map(async driver => {
      try {
        aggregatedCitationByDriver[driver.database] = await driver.forageCitation(citation, options);
      } catch (error) {
        console.log(`${driver.database}: Something went wrong.`);
      }
    }))

    return Object.values(aggregatedCitationByDriver).reduce((a, b) => ({ ...a, ...b }));
  }));

  console.log(`Finished foraging`);

  return aggregatedCitations;
}

const forager = {
  forageCitations,
}

module.exports = forager;
