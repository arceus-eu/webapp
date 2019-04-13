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
    window.onAddTree = this.onTreeAdd;
    window.onUpdateTree = this.onTreeUpDate;
  };

  onTreeUpDate (data) {
    console.log(data);
  }

  onTreeAdd (data) {
    console.log(data);
  }

  async addTree (tree) {
      return await window.treeMap.addTree(tree);
  }

  async updateTree (tree) {
    return await window.treeMap.updateTree(tree);
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
