// @flow

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Map, TileLayer, type Viewport, CircleMarker, GeoJSON } from 'react-leaflet';
import  MarkerClusterGroup from 'react-leaflet-markercluster';
import L from 'leaflet';

import './map.css';

require('react-leaflet-markercluster/dist/styles.min.css');

const DEFAULT_VIEWPORT = {
    center: [53.21, 6.56],
    zoom: 13,
    maxZoom: 20,
    preferCanvas: true
};

export default class ViewportExample extends Component<
    {},
    { viewport: Viewport,
      markers: GeoJSON
    },
    > {
    state = {
        viewport: DEFAULT_VIEWPORT,
        markers: []
    };

    componentDidMount = () => {

        var me = this;

        (async () => {
            const response = await fetch('./data/groningen_trees_wgs84.geojson');

            const data = await response.json();
            const markers = <GeoJSON
                data = {data}
                pointToLayer = {(geoObj, latLng) => {
                    return L.circleMarker(latLng, {
                        radius: 2,
                        color : '#226d29'
                    })
                    }
                }
                onEachFeature ={(feature, layer) => {
                    layer.on('click', (tree) => {
                        console.log(feature);
                    })
                    }
                }
                />;
            me.setState({ markers });

        })();
    };

    onClickReset = () => {
        this.setState({ viewport: DEFAULT_VIEWPORT })
    };

    onViewportChanged = (viewport: Viewport) => {
        this.setState({ viewport })
    };

    render() {
        return (
            <Map
                ref="treemap"
                onClick={this.onClickReset}
                onViewportChanged={this.onViewportChanged}
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
        )
    }
}
