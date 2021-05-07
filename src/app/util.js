import { calculate } from "sunrise-sunset-js";

const DEFAULT_ZENITH = 90.8333;

export const polarToCartesian = (radius, angle) => {
  let outputX = radius * Math.cos(angle);
  let outputY = radius * Math.sin(angle);
  return {'X': outputX, 'Y': outputY};
}

export const hourAngle = (amount, dial = 24) => {
    let increment = Math.PI / (dial / 2);
    if (dial === 12) return increment * amount - (Math.PI / 2);
    return increment * amount + (Math.PI / 2);
}

export const minuteAngle = (amount) => {
  let increment = Math.PI / 30;
  return increment * amount - (Math.PI / 2);
}

export const getSunrise = (latitude, longitude, date = new Date(), zenith = DEFAULT_ZENITH) => {
  let event = calculate(latitude, longitude, true, zenith, date);
  return event.getHours() + (event.getMinutes() / 60) + (event.getSeconds() / 3600);
}

export const getSunset = (latitude, longitude, date= new Date(), zenith = DEFAULT_ZENITH) => {
  let event = calculate(latitude, longitude, false, zenith, date);
  return event.getHours() + (event.getMinutes() / 60) + (event.getSeconds() / 3600);
}
