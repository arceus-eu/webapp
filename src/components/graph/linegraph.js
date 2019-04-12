import React, { Component } from 'react';
// import { Doughnut } from 'react-chartjs-2'; 
import ReactChartkick, { BarChart } from 'react-chartkick'
import Card from '@material-ui/core/Card';
import Chart from 'chart.js'

export class Graph extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: null
        }
    }
    async componentDidMount(){
        // const response = await fetch('./data/smallSet.geojson');
        // const data = await response.json();
        // this.setState({data: data})
    }

    render() {
      return (
        <Card style={{marginTop: 40, marginBottom: 40, marginLeft: '5%', marginRight: '5%'}}>
            <div>
            {/* <LineChart data={{"2017-05-13": 2, "2017-05-14": 5}} /> */}
            </div>
            <div>
                <BarChart stacked={true}  colors={[["green", "red"]]} data={[["Positive", this.props.positive], ["Negative", this.props.negative ]]} />
            </div>
        </Card>
      )
    }
  }