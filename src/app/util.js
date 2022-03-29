import { calculate } from "sunrise-sunset-js";

const DEFAULT_ZENITH = 90.8333;

export const toDegrees = (radAngle) => radAngle * (180 / Math.PI);
export const toRadians = (degAngle) => degAngle * (Math.PI / 180);


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

export const decimalHour = (date) => {
  return date.getHours() + (date.getMinutes() / 60) + (date.getSeconds() / 3600);
}

export const decimalMinute = (date) => {
  return date.getUTCMinutes() + (date.getUTCSeconds() / 60);
}
