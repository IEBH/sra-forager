const fs = require('fs');
const forager = require('.');

const citations = [
  { pmid: '19826172' }
]

const scenario = async () => {
  const foragedCitations = await forager.forageCitations(citations, {
    drivers: [
      {
        database: 'europepmc',
      },
      {
        database: 'scopus',
        config: {
          apiKey: '95b32c5ac320f88318b3af2c5c862357',
        }
      }
    ]
  })

  return foragedCitations;
}

scenario().then((foragedCitations) =>{
  fs.writeFileSync('./scenario-output.json', JSON.stringify({
    original: citations, 
    foraged: foragedCitations
  }));
}).catch(console.log);