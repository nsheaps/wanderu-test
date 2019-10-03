function toRadians(num) {
  if (typeof num !== 'number') {
    throw new TypeError(`${num} is not a number`);
  }

  return num * (Math.PI / 180);
}

module.exports = {
  /**
   * Gets the distance in meters between two latitude/longitude locations on earth
   * Graciously taken from https://www.movable-type.co.uk/scripts/latlong.html
   * @param {float} lat1 latitude of location 1
   * @param {float} long1 longitude of location 1
   * @param {float} lat2 latitude of location 2
   * @param {float} long2 longitude of location 2
   */
  getDistance(lat1, long1, lat2, long2) {
    const earthsRadius = 6371e3; // meters
    const phi1 = toRadians(lat1);
    const phi2 = toRadians(lat2);
    const deltaLat = toRadians(lat2 - lat1);
    const deltaLong = toRadians(long2 - long1);

    const a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2)
                + Math.cos(phi1) * Math.cos(phi2)
                * Math.sin(deltaLong / 2) * Math.sin(deltaLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return earthsRadius * c;
  },
};
