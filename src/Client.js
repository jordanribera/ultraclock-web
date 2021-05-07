import React from "react";
import "./Client.css";
import Clock from "./components/Clock";

class Client extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render(dispatch) {
    return (
      <div>
        client test
        <Clock />
      </div>
    )
  }
}

export default Client;
