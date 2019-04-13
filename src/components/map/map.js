// @flow

import React, { Component } from 'react';

import { JaavTMClient as Client } from "../../blockchain/client.js";

import 'bootstrap/dist/css/bootstrap.css';
import { Map, TileLayer, type Viewport, CircleMarker, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import { Graph } from '../graph/linegraph'
import Geolocated from '../geo/location'
// TODO: Move me to separate component if we have time
// import MapModal from '../mapModal';
import './map.css';

// styles
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';

require('react-leaflet-markercluster/dist/styles.min.css');

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const DEFAULT_VIEWPORT = {
  center: [53.21, 6.56],
  zoom: 13,
  maxZoom: 20,
  preferCanvas: true
};

class SimpleMap extends Component {
  state = {
    viewport: DEFAULT_VIEWPORT,
    markers: [],
    open: false,
    selectedTree: {
      properties: {
        id: '',
        city: '',
        xCord: '',
        yCord: '',
        geometry: []
      }
    },
    customizableTreeDetail: 'Customizable Tree Detail',
  };

  // shouldComponentUpdate(nextProps, nextState) {
  //     // console.log(nextProps)
  //     console.log(nextState.viewport)
  //     console.log(this.state.viewport)
  //     if (this.state.viewport === nextState.viewport) {
  //       return false;
  //     } else {
  //       return true;
  //     }
  //   }

  setLocation(location) {
    const viewport = {
      center: [location.latitude, location.longitude],
      zoom: 13,
      maxZoom: 20,
      preferCanvas: true
    };
    if (this.state.viewport.center[0] !== location.latitude) this.setState({ viewport: viewport })
  }

  // componentDidMount = async () => {


  // };

  componentDidMount = () => {
    var me = this;

    (async () => {
      const client = new Client();
      window.client = client;
      const account = await client.getWorkingAccount();
      const result = await fetch('./contracts/trees.js');
      const cls = await result.text();
      window.treeMap = await client.deployContract(cls, account, '1234');
      window.onAddTree = this.onTreeAdd;
      window.onUpdateTree = this.onTreeUpDate;
    })();

    (async () => {
      // const response = await fetch('./data/groningen_trees_wgs84.geojson');
      const response = await fetch('./data/smallSet.geojson');
      const data = await response.json();
      // this.setState({points: data})
      const markers = <GeoJSON
        data={data}
        pointToLayer={(geoObj, latLng) => {

          return L.circleMarker(latLng, {
            radius: 2,
            color: '#226d29'
          })
        }
        }
        onEachFeature={(feature, layer) => {
          layer.on('click', (tree) => {
            // Show modal with details
            this.handleClickOpen(feature);
          })
        }
        }
      />;

      me.setState({ markers });
    })();
  };

  handleClickOpen = (feature) => {
    const { properties, geometry } = feature;
    this.setState({
      selectedTree: {
        id: properties.LINKNR,
        city: properties.OMSCHRIJVA,
        houseNumber: properties.OMSCHRIJV,
        xCord: properties.XCOORD,
        yCord: properties.YCOORD,
        geometry: geometry.coordinates,
        specieCode: properties.BOOMSOORT,
        specieNameNed: properties.NEDNAAM,
        specieNameLat: properties.LATNAAM,
        dateOfBirth: properties.KIEMJAAR,
        heightNumber: properties.BOOMHOOGTE,
        heightDescription: properties.OMSCHRIJVE,
        ownerShip: properties.EIGENAAR,
        plantingDesc: properties.OMSCHRIJVQ
      }
    });

    this.setState({ open: true });
  };

  handlePopupClose = () => {
    this.setState({ open: false });
  };

  onClickReset = () => {
    // TODO: For now we have disabled reset
    // this.setState({ viewport: DEFAULT_VIEWPORT })
  };

  onViewportChanged = (viewport: Viewport) => {
    this.setState({ viewport })
  };

  renderSelectedTree = () => {
    // const tree = this.state.selectedTree;

    // TODO: Add more properties to display
    return (
      <div className={this.props.classes.root}>
        Specie Name Latin: <strong>{this.state.selectedTree.specieNameLat}</strong> <br />
        Date of Birth: <strong>{this.state.selectedTree.dateOfBirth}</strong> <br />
        Ownership: <strong>{this.state.selectedTree.ownerShip}</strong> <br />
        Height: <strong>{this.state.selectedTree.heightNumber}</strong> <br />
      </div>
    );
  };

  handleTreeDetailChange = () => event => {
    this.setState({ customizableTreeDetail: event.target.value });
  };

  // BLOCKCHAIN START
  onTreeUpDate(data) {
    console.log(data);
  }

  onTreeAdd(data) {
    console.log(data);
  }

  async getTree(id) {
    return await window.treeMap.getTree(id);
  }

  async getTrees() {
    console.log('getTrees(): ', await window.treeMap.getTrees());
    debugger;
    return await window.treeMap.getTrees();
  }

  async addTree(tree) {
    return await window.treeMap.addTree(tree);
  }

  async updateTree(tree) {
    return await window.treeMap.updateTree(tree);
  }
  // BLOCKCHAIN END

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        {/*<Geolocated setLocation={(value) => this.setLocation(value)} />*/}
        <Map
          ref="treemap"
          onClick={this.onClickReset}
          onViewportChanged={this.onViewportChanged}
          onMoveend={(value) => console.log(value)}
          maxZoom={20}
          viewport={this.state.viewport}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup
            disableClusteringAtZoom={16}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={false}
          >
            {this.state.markers}
          </MarkerClusterGroup>
        </Map>
        {/* <Graph
          positive={20}
          negative={23}
        /> */}
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Tree Details"}
          </DialogTitle>

          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              <div className={classes.root}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    {/* Selected Tree Details */}
                    {this.renderSelectedTree()}
                  </Grid>

                  <Grid item xs>
                    {/* Selected Tree Details */}
                    <TextField
                      id="tree-customizable-detail"
                      label="Customizable Tree Detail"
                      className={classes.textField}
                      value={this.state.name}
                      onChange={this.handleTreeDetailChange()}
                      margin="normal"
                    />
                  </Grid>

                </Grid>
              </div>
            </DialogContentText>


          </DialogContent>
          <DialogActions>
            <Button size="small" variant="outlined" color="primary" className={classes.button}>Take A Photo</Button>
            <Button 
              onClick={this.getTrees}
              size="small" 
              variant="outlined" 
              color="secondary" 
              className={classes.button}>IDDQD</Button>
            <Button onClick={this.handlePopupClose} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      </Grid>
    )
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  textField: {
    width: '100%',
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  paperModal: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: 420,
  },
  button: {
    margin: theme.spacing.unit,
  },
  input: {
    display: 'none',
  },

});

export default withStyles(styles)(SimpleMap);
