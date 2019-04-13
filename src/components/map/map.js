import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import { Map, TileLayer, type Viewport, CircleMarker, GeoJSON } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';
import { TreeMap } from './treemap';

// styles
import './map.css';
import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';

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
    data: {},
    viewport: DEFAULT_VIEWPORT,
    markers: [],
    open: false,
    selectedTree: {},
    customizableTreeDetail: 'Customizable Tree Detail',
  };

  layerCount = 0;

  constructor(props) {
    super(props);

    this.onMapClick.bind(this);
    this.leafletMap = React.createRef();
  }

  treeMap: TreeMap;

  setLocation(location) {
    const viewport = {
      center: [location.latitude, location.longitude],
      zoom: 13,
      maxZoom: 20,
      preferCanvas: true
    };
    if (this.state.viewport.center[0] !== location.latitude) this.setState({ viewport: viewport })
  }

  componentDidMount = () => {
    var me = this;

    this.treeMap = new TreeMap(true);
    this.treeMap.connect().then(() => {
        me.treeMap.getGEOJson().then(geojson => {
            me.state.data = geojson;
            const markers = me.getMarkers(me.state.data);
            me.setState({ markers });
            this.layerCount++;
        }).catch(err => {
          console.log(err);
        });
    });
  };

  getMarkers(data) {

    const me = this;
    this.layerCount++;

    return <GeoJSON
        key={'geo' + this.layerCount}
        data = {data}
        pointToLayer = {
            (geoObj, latLng) => {
                return L.circleMarker(latLng, {
                    radius: 2,
                    color: '#226d29'
                })
            }
        }
        onEachFeature={(feature, layer) => {
            layer.on('click', (tree) => {
                me.handleClickOpen(feature);
            })
          }
    } />;
  }

  handleClickOpen (feature) {
    const { properties, geometry } = feature;
    this.setState({
       selectedTree: feature
    });
    this.setState({ open: true });
  };

  handlePopupClose() {
    this.setState({ open: false });
  };

  onMapClick(event) {

    const geometry = {
      coordinates: [event.latlng.lng, event.latlng.lat],
      type: "Point"
    };

    const id = Math.random().toString(36).replace(/[^a-z]+/g, '');
    const feature = this.treeMap.getNewTreeTemplate(id, 0, new Date().getFullYear(), geometry);

    const features = this.state.data.features;
    features.push(feature);
    const markers = this.getMarkers(this.state.data);
    this.setState({ markers });
  };

  onViewportChanged(viewport: Viewport) {
  };

  renderSelectedTree() {
    return (
      <div className={this.props.classes.root}>
        Specie Name Latin: <strong>{this.state.selectedTree.specieNameLat}</strong> <br />
        Date of Birth: <strong>{this.state.selectedTree.dateOfBirth}</strong> <br />
        Ownership: <strong>{this.state.selectedTree.ownerShip}</strong> <br />
        Height: <strong>{this.state.selectedTree.heightNumber}</strong> <br />
      </div>
    );
  };

  handleTreeDetailChange(event) {
    const value = event.target.value;
    const newTree = { heightNumber: value };
    const obj = Object.assign(this.state.selectedTree, newTree);

    this.setState({ selectedTree: obj });
  };


  updateTree() {
    var me = this;
    this.treeMap.updateTree(me.state.selectedTree).then(data => {
      console.log(data);
    });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container>
        {
          /*<Geolocated setLocation={(value) => this.setLocation(value)} />*/
        }
        <Map
          ref={this.leafletMap}
          onClick={(e)=> this.onMapClick(e)}
          onViewportChanged={this.onViewportChanged}
          onMoveend={(value) => console.log(value)}
          maxZoom={20}
          viewport={this.state.viewport}>
          <TileLayer
            attribution = '&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MarkerClusterGroup
            disableClusteringAtZoom={16}
            maxClusterRadius={60}
            spiderfyOnMaxZoom={false}
          >
            {this.state.markers}
          </MarkerClusterGroup>
        </Map>
        {}
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
                      value={this.state.selectedTree.heightNumber}
                      onChange={this.handleTreeDetailChange}
                    />
                  </Grid>

                </Grid>
              </div>
            </DialogContentText>


          </DialogContent>
          <DialogActions>
            <Button
              size="small"
              variant="outlined"
              color="primary"
              disabled
              className={classes.button}>Take A Photo</Button>

            <Button
              onClick={this.updateTree}
              size="small"
              variant="outlined"
              color="secondary"
              className={classes.button}>Save</Button>

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
  input: {
    margin: theme.spacing.unit,
  },
  paperModal: {
    padding: theme.spacing.unit * 2,
    margin: 'auto',
    maxWidth: 420,
  },
  button: {
    margin: theme.spacing.unit,
  }

});

export default withStyles(styles)(SimpleMap);
