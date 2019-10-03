/* eslint-disable import/prefer-default-export */
const axios = require('axios');
const { getDistance } = require('../util');

// for some strange reason this API is supposed to be the same but doesn't like the
// the query for getting the routes
// const BASE_URL = 'https://api.deutschebahn.com/1bahnql/v1';
const BASE_URL = 'https://bahnql.herokuapp.com';

class UnhandledRoutingException extends Error {}

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 5000, // ms
  headers: { Authorization: `Bearer ${process.env.API_DEUTSCHEBAHN_BEARER_TOKEN}` },
});

module.exports = {
  async getNearbyStations(latitude, longitude, count = 5) {
    const response = await client.post('/graphql', {
      query: `
        {
          nearby(latitude:${latitude}, longitude:${longitude}) {
            stations(count:${count + 1}) { # strangely only provides count-1, so this ensures requested count is provided
              primaryEvaId,
              name,
              location {
                latitude,
                longitude
              }
              hasParking,
              hasLocalPublicTransport,
            }
          }
        }
      `,
    });

    return response.data.data.nearby.stations;
  },
  async getRoutes(from, to) {
    try {
      const response = await client.post('/graphql', {
        query: `
          {
            routing(from: ${from}, to: ${to}) {
              parts {
                from {
                  name,
                  primaryEvaId,
                  location {
                    latitude,
                    longitude
                  }
                },
                to {
                  name,
                  primaryEvaId,
                  location {
                    latitude,
                    longitude
                  }
                }
              }
            }
          }
        `,
      });

      // there may be multiple routes offered, just pick the first one.
      return response.data.data.routing[0].parts.map((part) => {
        // this API doesn't provide travel distances, so we'll estimate on our
        // own using a distance calcuation based on lat/long of the stations
        // eslint-disable-next-line no-param-reassign
        part.distance = getDistance(
          part.from.location.latitude,
          part.from.location.longitude,
          part.to.location.latitude,
          part.to.location.longitude,
        );
        return part;
      });
    } catch (e) {
      throw new UnhandledRoutingException(`Unable to get route from ${from} to ${to}`);
    }
  },
};
