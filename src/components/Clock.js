import React from "react";
import { getSunrise, getSunset } from "../app/sundial";
import { ZENITH_DEFAULT, ZENITH_CIVIL, ZENITH_NAUTICAL, ZENITH_ASTRONOMICAL } from "../app/sundial";

import { decimalHour, decimalMinute, hourAngle, minuteAngle, polarToCartesian } from "../app/util";

class Clock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      now: new Date(),
    };
  }

  tick() {
    this.setState(state => ({
      now: new Date(),
    }));
  }

  componentDidMount() {
    this.interval = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

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
              {this.getShade(ZENITH_DEFAULT, "#add8e6")}
              {this.getShade(ZENITH_CIVIL, "#c0c0c0")}
              {this.getShade(ZENITH_NAUTICAL, "#808080")}
              {this.getShade(ZENITH_ASTRONOMICAL, "#606060")}
              {this.getNumerals()}
              {this.getHands()}
              {this.getMarkings()}
              {this.getDigitalClock()}
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
            let fillColor = "white"
            if (i === 0) fillColor = "#8080FF";
            if (i === 12) fillColor = "#FFFF80";
            return (
              <circle
                cx={c.X + 210}
                cy={c.Y + 210}
                r="12"
                stroke="black"
                stroke-width="2"
                fill={fillColor}
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

  getMarkings() {
    let numerals = [...Array(60).keys()];
    return (
      <g>
        {numerals.map((i) => {
          let lineLength = 8;
          if (i % 5 == 0) lineLength = 16;

          let innerCoordinates = polarToCartesian(200 - lineLength, minuteAngle(i));
          let outerCoordinates = polarToCartesian(200, minuteAngle(i));
          return (
            <line
              x1={innerCoordinates.X + 210}
              y1={innerCoordinates.Y + 210}
              x2={outerCoordinates.X + 210}
              y2={outerCoordinates.Y + 210}
              stroke="black"
              stroke-width="2"
            />
          );
        })}
        <circle
          cx="210"
          cy="210"
          r="200"
          stroke="black"
          stroke-width="2"
          fill="none"
        />
        <circle
          cx="210"
          cy="210"
          r="100"
          stroke="black"
          stroke-width="2"
          fill="none"
        />
      </g>
    );
  }

  getShade(zenith = ZENITH_DEFAULT, color = "silver") {
    let arcStart = polarToCartesian(199, hourAngle(decimalHour(getSunrise(47.45, -122.3, zenith))));
    let arcEnd = polarToCartesian(199, hourAngle(decimalHour(getSunset(47.45, -122.3, zenith))));
    let pathString = `M210 210 L${arcStart.X + 210},${arcStart.Y + 210} A199,199 0 0,0 ${arcEnd.X + 210},${arcEnd.Y + 210} L210 210 Z`
    return (
      <g>
        <path
          fill={color}
          d={pathString}
        />
        <circle
          cx="210"
          cy="210"
          r="100"
          fill="white"
        />
      </g>
    );
  }

  getHands() {
    let hourHandAngle = hourAngle(decimalHour(this.state.now));
    let hourInner = polarToCartesian(100, hourHandAngle);
    let hourOuter = polarToCartesian(130, hourHandAngle);

    let minuteHandAngle = minuteAngle(decimalMinute(this.state.now));
    let minuteInner = polarToCartesian(170, minuteHandAngle);
    let minuteOuter = polarToCartesian(200, minuteHandAngle);

    let secondHandAngle = minuteAngle(this.state.now.getSeconds());
    let secondInner = polarToCartesian(170, secondHandAngle);
    let secondOuter = polarToCartesian(200, secondHandAngle);
    return (
      <g>
        <line
          x1={hourInner.X + 210} y1={hourInner.Y + 210}
          x2={hourOuter.X + 210} y2={hourOuter.Y + 210}
          stroke="black" stroke-width="8"
        />
        <line
          x1={minuteInner.X + 210} y1={minuteInner.Y + 210}
          x2={minuteOuter.X + 210} y2={minuteOuter.Y + 210}
          stroke="black" stroke-width="4"
        />
        <line
          x1={secondInner.X + 210} y1={secondInner.Y + 210}
          x2={secondOuter.X + 210} y2={secondOuter.Y + 210}
          stroke="red" stroke-width="2"
        />

      </g>
    );
  }

  getDigitalClock() {
    let hours = this.state.now.getHours().toString().padStart(2, "0")
    let minutes = this.state.now.getMinutes().toString().padStart(2, "0")
    let seconds = this.state.now.getSeconds().toString().padStart(2, "0")

    return (
      <text
        text-anchor="middle"
        x={210}
        y={210 + 21}
        font-size="42"
      >
        {hours}:{minutes}:{seconds}
      </text>

    );
  }
}

export default Clock;
