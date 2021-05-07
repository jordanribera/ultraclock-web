let toDegrees = (radAngle) => radAngle * (180 / Math.PI);
let toRadians = (degAngle) => degAngle * (Math.PI / 180);


class Sundial {
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }

  calculateEvent(event) {
      let zenith = 90; // civil=96, official=90

      // 1. first calculate the day of year
      Date.prototype.getDOY = function () {
        var onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((this - onejan) / 86400000);
      }
      let now = new Date();
      let N = now.getDOY();

      // 2. convert the longitude to an hour value and calculate approx. time
      let lngHour = this.longitude / 15;
      let t = 0;
      if (event === 'rise') t = N + ((6 - lngHour) / 24);
      if (event === 'set') t = N + ((18 - lngHour) / 24);

      // 3. calculate the sun's mean anomaly
      let M = (0.9856 * t) - 3.289;

      // 4. calculate the sun's true longitude
      let L = M + (1.916 * Math.sin(toRadians(M))) + (0.020 * Math.sin(toRadians(2 * M))) + 282.634;
      // note: L needs to be adjusted into the range of 0-360
      if (L < 0) L += 360;
      if (L >= 360) L -= 360;

      // 5a. calculate the sun's right ascension
      let RA = toDegrees(Math.atan(0.91764 * Math.tan(toRadians(L))));
      // note: RA needs to be adjusted into the range of 0-360
      if (RA < 0) RA += 360;
      if (RA >= 360) RA -= 360;

      // 5b. right ascension value needs to be in the same quadrant as L
      let Lquadrant = (Math.floor(L/90)) * 90;
      let RAquadrant = (Math.floor(RA/90)) * 90;
      RA = RA + (Lquadrant - RAquadrant);

      // 5c. convert right ascension into hours
      RA = RA / 15;

      // 6. calculate the sun's declination
      let sinDec = 0.39782 * Math.sin(toRadians(L));
      let cosDec = Math.cos(toRadians(toDegrees(Math.asin(sinDec))));

      // 7a. calculate the sun's local hour angle
      let cosH = (Math.cos(toRadians(zenith)) - (sinDec * Math.sin(toRadians(this.latitude)))) / (cosDec * Math.cos(toRadians(this.latitude)));
      // if (cosH > 1) the sun never rises at this location on this date
      // if (cosH < -1) the sun never sets at this location on this date

      // 7b. finish calculating H and convert into hours
      let H = 0;
      if (event === 'rise') H = 360 - toDegrees(Math.acos(cosH));
      if (event === 'set') H = toDegrees(Math.acos(cosH));
      H = H / 15;

      // 8. calculate the local mean time of the event
      let T = H + RA - (0.06571 * t) - 6.622;

      // 9. adjust back to UTC
      let UT = T - lngHour;
      // note: UT needs to be adjusted into the range of 0-24
      if (UT < 0) UT += 24;
      if (UT >= 24) UT -= 24;

      // 10. convert UT value to local time zone of latitude/longitude
      let localOffset = -8;
      let localT = UT + localOffset;
      if (localT < 0) localT += 24;
      if (localT >= 24) localT -= 24;

      return localT % 24;
  }
}

export default Sundial;
