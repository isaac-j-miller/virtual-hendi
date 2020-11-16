import React, { Component} from 'react';
import Dygraph from 'dygraphs';
import '../Style/VirtualHendiInterface.css';
import { saveAs } from 'file-saver';
export default class Spectrum extends Component{
    constructor(props){
        super(props);
        this.chartRef = React.createRef();
        this.d = undefined;
        this.generateSpectrum = this.generateSpectrum.bind(this);
        this.downloadSpectrum = this.downloadSpectrum.bind(this);
    }
    generateSpectrum() {
        return new Dygraph(this.chartRef.current, this.props.data, {
            animatedZooms:true,
            xlabel:"Wavelength (cm<sup>-1</sup>)",
            ylabel:"Intensity",
            width: 'auto',
            height: 'auto',
            xValueParser: parseFloat
        });
    }
    componentDidMount() {
        this.d = this.generateSpectrum();
    }
    downloadSpectrum() {
        const blob = new Blob([this.props.data], {type: 'text/plain;charset=utf-8'});
        saveAs(blob, "spectrum.csv");
    }
    render(){
        return <div>
            <div id="spectrum" ref={this.chartRef}/>
                <button onClick={this.downloadSpectrum}>Download Spectrum</button>
            </div>
    }
}