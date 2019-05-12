
### SRA FORAGER
This module is part of the [Bond University Centre for Research in Evidence-Based Practice](https://github.com/CREBP) Systematic Review Assistant suite of tools.

The purpose of forager is aggregate information about a citation from multiple sources, not limited to identifiers, abstracts and urls to the papers.

## Supported sources
Sources can be found in the ```./drivers``` directory.

* **Europepmc**
* **Scopus**

## Forager API

### forager.forageCitations

forager.forageCitations(citations, options)

Takes a list of citations and returns a promise with the foraged citations.

Options: 
* **drivers** - A list of the drivers to use.

Example:
```sh
  const forager = require('sra-forager');

  const citations = [
    { doi: '10.1016/S0092-8674(00)81683-9' },
  ];

  const options = {
    drivers: [
      { database: 'europepmc' },
      {
        database: 'scopus',
        config: {
          apiKey: '',
        }
      }
    ]
  };

  const foragedCitations = await forager.forageCitations(citations, options);
```

## Driver API

Drivers are orchestrated by the forager. Each driver implements the same interface.

### forager.forageCitation

forager.forageCitation(citation)

Takes a single citation and returns a promise with the foraged citation.


Example:
```sh
  const forager = require('sra-forager');

  const citation = { doi: '10.1016/S0092-8674(00)81683-9' };

  const foragedCitation = await driver.forageCitation(citation);
```
