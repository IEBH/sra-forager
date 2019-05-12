
### SRA FORAGER
This module is part of the [Bond University Centre for Research in Evidence-Based Practice](https://github.com/CREBP) Systematic Review Assistant suite of tools.

The purpose of forager is aggregate information about a citation from multiple sources, not limited to identifiers, abstracts and urls to the papers.

```sh
  const { forageCitations } = require('sra-forager');

  const citations = [
    { doi: '10.1016/S0092-8674(00)81683-9' },
  ];

  const foragedCitations = await forageCitations(citations);

  /* Foraged citations will contain any new fields that could be aggregated. */
```


## Supported sources
Sources can be found in the ```./drivers``` directory.

* **Europepmc**
* **Scopus**

## Forager API

### forager.forageCitations

forager.forageCitations(citations)

Takes a list of citations and returns a promise with the foraged citations.

## Driver API

Drivers are orchestrated by the forager. Each driver implements the same interface.

### forager.forageCitation

forager.forageCitation(citation)

Takes a single citation and returns a promise with the foraged citation.