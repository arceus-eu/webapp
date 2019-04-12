import React from 'react';
import {geolocated} from 'react-geolocated';
 
class Demo extends React.Component {
  render() {
      if (!this.props.isGeolocationAvailable) return (
         <div>Your browser does not support Geolocation</div>
      )
      if (!this.props.isGeolocationEnabled) return (
        <div>Geolocation is not enabled</div>
      )
      if (this.props.coords) {
          this.props.setLocation(this.props.coords)
          return (
            <table align="center">
            <tbody>
            <tr><td>latitude</td><td>{this.props.coords.latitude}</td></tr>
            <tr><td>longitude</td><td>{this.props.coords.longitude}</td></tr>
            {/* <tr><td>altitude</td><td>{this.props.coords.altitude}</td></tr>
            <tr><td>heading</td><td>{this.props.coords.heading}</td></tr>
            <tr><td>speed</td><td>{this.props.coords.speed}</td></tr> */}
            </tbody>
        </table>
          )
      }
        return ( <div>Getting the location data&hellip; </div> )
  }
}
 
export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000,
})(Demo);