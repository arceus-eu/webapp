import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import { SnackbarProvider, withSnackbar } from 'notistack';


class App extends Component {

  render() {
    return (
      <SnackbarProvider maxSnack={3}>
        <Map />
      </SnackbarProvider>
    );
  }
}

export default App;
