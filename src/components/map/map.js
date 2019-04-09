// @flow

import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Map, TileLayer, type Viewport } from 'react-leaflet';
import './map.css';

require('react-leaflet-markercluster/dist/styles.min.css');

const DEFAULT_VIEWPORT = {
    center: [53.21, 6.56],
    zoom: 13
};

export default class ViewportExample extends Component<
    {},
    { viewport: Viewport },
    > {
    state = {
        viewport: DEFAULT_VIEWPORT,
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
                onClick={this.onClickReset}
                onViewportChanged={this.onViewportChanged}
                viewport={this.state.viewport}>
                <TileLayer
                    attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </Map>
        )
    }
}
