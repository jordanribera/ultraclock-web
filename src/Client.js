import React from "react";
import "./Client.css";
import Clock from "./components/Clock";

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(dispatch) {
    // <Clock latitude={19.70} longitude={-155.1} />
    // <Clock latitude={35.48} longitude={139.3} />
    return (
      <div>
        <Clock latitude={47.45} longitude={-122.3} />
      </div>
    )
  }
}

export default Client;
