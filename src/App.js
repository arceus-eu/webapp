import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import { JaavTMClient as Client } from "./blockchain/client.js";

class App extends Component {

  componentDidMount = async () => {

    const client = new Client();
    window.client = client;
    const account = await client.getWorkingAccount();
    const result = await fetch('./contracts/trees.js');
    const cls = await result.text();
    window.treeMap = await client.deployContract(cls, account, '1234');
  };

  render() {
    return (
      <div>
        <Map />
      </div>
    );
  }
}

export default App;
