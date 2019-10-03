/* eslint-disable no-console */
const api = require('./api/deutschebahn');

const BERLIN_LATLONG = [52.520008, 13.404954];
const HAMBURG_LATLONG = [53.551086, 9.993682];
const TOTAL_TRIPS = 5;
const SOURCE_STATIONS = 5;
const DESTINATION_STATIONS = 5;

function printStationInfo(station) {
  const amenities = [];
  if (station.hasParking) { amenities.push('parking'); }
  if (station.hasLocalPublicTransport) { amenities.push('public transit'); }

  console.info(`  ${station.name} (id: ${station.primaryEvaId})`);
  console.info(`    Amenities: ${amenities.join(', ')}`);
  console.info();
}

async function main() {
  // This makes multiple API requests for the purpose of demonstration but can be
  // consolidated into a single request to reduce round trips. This is also done
  // serially for ease.
  const berlinStations = await api.getNearbyStations(...BERLIN_LATLONG, DESTINATION_STATIONS);
  console.info(`Berlin Stations (Limit: ${DESTINATION_STATIONS}):`);
  berlinStations.forEach(printStationInfo);

  const hamburgStations = await api.getNearbyStations(...HAMBURG_LATLONG, SOURCE_STATIONS);
  console.info(`Hamburg Stations (Limit: ${SOURCE_STATIONS}):`);
  hamburgStations.forEach(printStationInfo);

  const validDestinations = berlinStations.filter((station) => station.hasLocalPublicTransport);
  const validSources = hamburgStations.filter((station) => station.hasParking);

  const trips = [];

  for (let i = 0; (i < validSources.length && trips.length < TOTAL_TRIPS); i++) {
    const source = validSources[i];
    for (let j = 0; (j < validDestinations.length && trips.length < TOTAL_TRIPS); j++) {
      const destination = validDestinations[j];

      try {
        // this is also done serially for demonstration purposes but can be parallelized
        const trip = await api.getRoutes(source.primaryEvaId, destination.primaryEvaId);
        trips.push(trip);
      } catch (e) {
        // do nothing, this API is very fragile and returns 500s for really strange things
      }
    }
  }

  console.info(`Valid Trips (Limit: ${TOTAL_TRIPS}):`);
  trips.forEach((trip) => {
    console.info(`  From ${trip[0].from.name} to ${trip[trip.length - 1].to.name}`);
    console.info(`    Distance: ${Math.ceil(trip.reduce((total, step) => total + step.distance, 0)) / 1000} KM`);
    console.info(`    Stops:\n      ${trip.filter((part) => part.distance > 0).map((part) => part.from.name).join('\n      ')}`);
    console.info(`      ${trip[trip.length - 1].to.name}`);
    console.info();
  });
}


main();
