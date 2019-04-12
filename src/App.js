import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import { JaavTMClient as Client } from "./blockchain/client.js";

class App extends Component {

  componentDidMount = () => {

    const client = new Client();
    window.client = client;

    this.getWorkingAccount().then((address) => {

      fetch('./contracts/trees.js').then(result => {
          let cls = result.text().then(cls => {
              client.deployContract(cls, address, '1234').then((result) => {

              }).catch((err) => {

              });
          });
      });
    });
  };

  async getWorkingAccount() {

    const client = window.client;
    let result;

    try {
      result = await client.getAccount('Arceus', '1234');
  }
    catch (err) {
      result = await client.createAccount('Arceus', '1234');
    }

    return result.address || result.account;
  }

  render() {
    return (
      <div>
        <Map />
      </div>
    );
  }
}

export default App;
