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

import { SnackbarProvider, withSnackbar } from 'notistack';


require('react-leaflet-markercluster/dist/styles.min.css');

function Transition(props) {
  return <Slide direction="up" {...props} />;
}

const DEFAULT_TREE = {
  properties: {
    LATNAAM: '',
    KIEMJAAR: '',
    OMSCHRIJVP: '',
    BOOMHOOGTE: '',
  }
};

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
    selectedTree: {
      properties: {
        LATNAAM: '',
        KIEMJAAR: '',
        OMSCHRIJVP: '',
        BOOMHOOGTE: '',
      }
    },
    customizableTreeDetail: 'Customizable Tree Detail',
  };

  layerCount = 0;
  editorOpen = false;

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
    this.treeMap.connect().then((bcTreeMap) => {

      bcTreeMap.onAddTree = this.onAddTree.bind(me);
      bcTreeMap.onUpdateTree = this.onUpdateTree.bind(me);

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
      data={data}
      pointToLayer={
        (geoObj, latLng) => {
          return L.circleMarker(latLng, {
            radius: 2,
            color: '#226d29'
          })
        }
      }
      onEachFeature={(feature, layer) => {
        layer.on('click', (ev) => {
          me.editorOpen = true;
          ev.originalEvent.stopPropagation();
          me.handleClickOpen(feature);
        })
      }
      } />;
  }

  onUpdateTree(feature) {
    this.setState({
      selectedTree: feature
    });

    const me = this;
    const features = me.state.data.features;

    const changedFeature = features.find(item => item.properties.LINKNR === item.properties.LINKNR);
    if (changedFeature) {
      Object.assign(changedFeature, feature);
      const markers = me.getMarkers(this.state.data);
      this.setState({ markers });
    }
  }

  onAddTree(feature) {
    const me = this;
    const features = me.state.data.features;
    features.push(feature);
    const markers = me.getMarkers(this.state.data);
    this.setState({ markers });
  }

  handleClickOpen(feature) {
    let featureToAdd;
    if (JSON.stringify(this.state.selectedTree) !== JSON.stringify(feature) && (JSON.stringify(this.state.selectedTree) !== JSON.stringify(DEFAULT_TREE))) {
      featureToAdd = this.state.selectedTree;
    }
    else {
      featureToAdd = feature;
    }

    this.setState({
      selectedTree: featureToAdd
    });

    this.setState({ open: true });
  };

  handlePopupClose() {
    this.editorOpen = false;
    this.setState({ open: false });
  };

  onMapClick(event) {
    debugger;
    const me = this;
    if (me.editorOpen)
      return;

    const geometry = {
      coordinates: [event.latlng.lng, event.latlng.lat],
      type: "Point"
    };

    const id = Math.random().toString(36).replace(/[^a-z]+/g, '');
    const feature = this.treeMap.getNewTreeTemplate(id, 0, new Date().getFullYear(), geometry);
    this.treeMap.addTree(feature).then(data => {
      //add waiting icon
    }).catch(err => console.log(err));
  };

  onViewportChanged(viewport: Viewport) {
  };

  handleFormInputChange = name => e => {
    const me = this;
    let selectedTreeCopy = JSON.parse(JSON.stringify(this.state.selectedTree));
    selectedTreeCopy.properties[name] =
      e.target.type === 'number' ? parseInt(e.target.value) : e.target.value; // Вечность пахнет нефтью...

    this.setState({
      selectedTree: selectedTreeCopy
    });

  };

  renderSelectedTree = (classes) => {
    const me = this;
    return (
      <div className={classes.root}>
        <TextField
          id="outlined-name"
          label="Specie Name Latin"
          className={classes.textField}
          value={this.state.selectedTree.properties.LATNAAM}
          onChange={this.handleFormInputChange('LATNAAM').bind(me)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="Date of Birth"
          className={classes.textField}
          type="number"
          value={this.state.selectedTree.properties.KIEMJAAR}
          onChange={this.handleFormInputChange('KIEMJAAR').bind(me)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="Ownership"
          className={classes.textField}
          value={this.state.selectedTree.properties.OMSCHRIJVP}
          onChange={this.handleFormInputChange('OMSCHRIJVP').bind(me)}
          margin="normal"
          variant="outlined"
        />
        <TextField
          id="outlined-name"
          label="Height"
          type="number"
          className={classes.textField}
          value={this.state.selectedTree.properties.BOOMHOOGTE}
          onChange={this.handleFormInputChange('BOOMHOOGTE').bind(me)}
          margin="normal"
          variant="outlined"
        />
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
    this.props.enqueueSnackbar("Saved! Changes may take time to take effect.");
  };

  render() {
    const { classes } = this.props;
    const me = this;

    return (
      <Grid container>
        {
          /*<Geolocated setLocation={(value) => this.setLocation(value)} />*/
        }
        <Map
          ref={this.leafletMap}
          onClick={(e) => this.onMapClick(e)}
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
                    {this.renderSelectedTree(classes)}
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
              onClick={this.updateTree.bind(me)}
              size="small"
              variant="outlined"
              color="secondary"
              className={classes.button}>Save</Button>

            <Button onClick={this.handlePopupClose.bind(me)} color="primary">Close</Button>
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

// export withSnackbar(SimpleMap);
export default withSnackbar(withStyles(styles)(SimpleMap));
