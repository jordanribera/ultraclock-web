import React from "react";
import { getSunrise, getSunset } from "sunrise-sunset-js";

import { polarToCartesian, hourAngle } from "../app/util";

class Clock extends React.Component {
  render() {
    let rise = getSunrise(47.45, -122.3).toString();
    let set = getSunset(47.45, -122.3).toString();

    return (
      <div>
          <div>ceci n'est pas une clock</div>
          <div>rise: {rise}</div>
          <div>set: {set}</div>
          <div class="analogClock">
            <svg height="420px" width="420px">
              <circle
                cx="210"
                cy="210"
                r="200"
                stroke="black"
                fill="white"
              />
              {this.getShade()}
              {this.getNumerals()}
            </svg>
          </div>
      </div>
    );
  }

  getNumerals() {
    let numerals = [...Array(24).keys()];
    return (
      <g>
        <g>
          {numerals.map((i) => {
            let c = polarToCartesian(150, hourAngle(i));
            return (
              <circle
                cx={c.X + 210}
                cy={c.Y + 210}
                r="12"
                stroke="black"
                fill="white"
              />
            );
          })}
        </g>
        <g>
          {numerals.map((i) => {
            let c = polarToCartesian(145, hourAngle(12));
            let rotation = `rotate(${15 * ((i + 12) % 24)}, 210 210)`
            return (
              <text
                textAnchor="middle"
                x={c.X + 210}
                y={c.Y + 210}
                transform={rotation}
              >
                {i}
              </text>
            );
          })}
        </g>
      </g>
    );
  }

  getShade() {
    let arcStart = polarToCartesian(198.6, hourAngle(getSunrise(-122.3, 47.45).getHours()));
    let arcEnd = polarToCartesian(198.6, hourAngle(getSunset(-122.3, 47.45).getHours()));
    let pathString = `M210 210 L${arcStart.X + 210},${arcStart.Y + 210} A198.6,198.6 0 1,1 ${arcEnd.X + 210},${arcEnd.Y + 210} L210 210 Z`
    return <path
      fill="silver"
      d={pathString}
    />
  }
}

export default Clock;
