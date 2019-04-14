import React, { Component } from 'react';
import './App.css';
import Map from './components/map';
import { SnackbarProvider, withSnackbar } from 'notistack';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    flexGrow: 1,
  },
  appbar: {
    alignItems: 'center',
  }
};

class App extends Component {


  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <AppBar className={classes.appbar} position="sticky" color="default">
          <Toolbar>
            <Typography variant="h6" color="inherit">
              Arceus
          </Typography>
          </Toolbar>
        </AppBar>
        <SnackbarProvider maxSnack={3}>
          <Map />
        </SnackbarProvider>
      </div>
    );
  }
}

export default withStyles(styles)(App);
