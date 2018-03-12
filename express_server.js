const PORT = process.env.PORT || 8080; // default port 8080
const readlineSync = require('readline-sync');
const icao = require('icao');
const airportDiagrams = require('airport-diagrams');
const notams = require('notams');
const MetarFetcher = require('metar-taf').MetarFetcher;
const metarFetcher = new MetarFetcher();
const TafFetcher = require('metar-taf').TafFetcher;
const tafFetcher = new TafFetcher();

let input = readlineSync.question('Please enter an ICAO code: ');
let airport = input.toUpperCase();

if (!icao[airport]) {
  console.log("#####\nAirport not found");
  console.log("Please try another search\n#####");
  return;
} else {

  console.log(`----`);
  console.log(`\n${airport}\n`);

  metarFetcher.getData(airport)
  .then((response) => {
    console.log(`############################`);
    console.log(`            METAR`);
    console.log(`############################`);
    console.log(response);
  }), ((error) => {
    console.error(error);
  });


  tafFetcher.getData(airport)
  .then((response) => {
    console.log(`############################`);
    console.log(`            TAF`);
    console.log(`############################`);
    console.log(response);
  }), ((error) => {
    console.error(error);
  });

  // Displays link to Airport Chart PDF if it's a U.S. airport
  const geoCheck = (airport) => {
    let firstChar = airport.substring(0, 1);
    if (firstChar === 'K' || firstChar === 'P') {
      airportDiagrams.list(airport)
      .then(results => {
        let result = results[0];
        let plateURL = (result['procedure']['url']);
        revisedURL = plateURL.substring(0, plateURL.length - 16);
        console.log(`############################`);
        console.log(`    AIRPORT DIAGRAM (PDF)`);
        console.log(` ${result['airport']} / ${result['ident']}`);
        console.log(`############################`);
        console.log(`${revisedURL}\n`);
      })
    } else { return };
  };
  geoCheck(airport);

  notams(airport, { format: 'DOMESTIC' })
  .then(results => {
    console.log(`############################`);
    console.log(`           NOTAMS`);
    console.log(`############################`);
    var notams = results[0]['notams'];
    notams.forEach((notam) => {
      console.log(notam);
    });
  });
};
