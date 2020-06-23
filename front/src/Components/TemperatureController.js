import React, {Component} from 'react';
import '../Style/TemperatureController.css';
import '../Style/VirtualHendiInterface.css';
import AdjustableDigitalReadout from './AdjustableDigitalReadout';
export default class TemperatureController extends Component{
    constructor(props){
        super(props);
        this.props=props;
        this.state={
            temperature:0
        }
    }
    render(){
        return(
            <div className='temp-controller' id = {this.props.id}>
                <div className='instrument-label-readout' id='temp-controller-temp'>
                    <label className='instrument-label'>Nozzle Temperature</label>
                    <AdjustableDigitalReadout parent={this} increment={0.5} state_to_mod='temperature' unit='K' min={0} max={50}></AdjustableDigitalReadout>
                </div>
               
            </div>
        )
    }
}