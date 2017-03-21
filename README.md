SRA-Forager
===========
This module is part of the [Bond University Centre for Research in Evidence-Based Practice](https://github.com/CREBP) Systematic Review Assistant suite of tools.

When supplied with a single or multiple references this module will attempt to resolve the URL to the paper via a number of difference sources.


```javascript
var Forager = require('sra-forager');
var forage = new Forager();

forage.populate('10.1016/S0092-8674(00)81683-9', function(err, urls) {
	// Urls should now be an object containing the URLs of the citations from various databases
});
```


Supported sources
-----------------
Sources can be found in the `./drivers` directory as independent modules.

* **bondLibrary** - Search via the [Bond University Library](https://library.bond.edu.au)
* **doi** - Simple link to the paper on the [DOI.org](http://www.doi.org) website (this really just glues the DOI of the paper to the doi.org url)
* **doiDx** - The resolved URL of the paper
* **google** - A simple [Google search](https://google.com)
* **googleScholar** - A simple search using [Google Scholar](https://scholar.google.com)
* **wos** - Web of Science (requires username / password). This search returns the URL on WoS, a link to related papers and a link to what this paper cites

