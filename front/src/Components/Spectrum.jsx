import React, {Component} from 'react';
import Dygraph from 'dygraphs';
import '../Style/VirtualHendiInterface.css'
export default class Spectrum extends Component{
    constructor(props){
        super(props);
        this.chartRef = React.createRef();
        this.state = {
            modal: true
        }
        this.d = undefined;
    }
    componentDidMount() {
        try {
            if(this.props.data) {
                this.d = new Dygraph(this.chartRef.current, this.props.data, {
                    animatedZooms:true,
                    xlabel:"Wavelength (cm<sup>-1</sup>)",
                    ylabel:"Intensity",
                    width: 'auto',
                    height: 'auto'
                });
            }
        }
        catch(err) {
            console.log(this.props.data);
        }
    }
    handleCloseModal() {
        this.setState({modal:false})
    }
    render(){
        return <div id="spectrum" ref={this.chartRef}/>
        
    }
}