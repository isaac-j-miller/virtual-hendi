import React, {Component} from 'react';
import '../Style/WavelengthController.css';
import '../Style/VirtualHendiInterface.css';
import AdjustableDigitalReadout from './AdjustableDigitalReadout';
export default class WavelengthController extends Component{
    constructor(props){
        super(props);
        this.props=props;
        this.state={
            min_lambda:2030,
            max_lambda:2090
        }
        this.validators = {
            min_lambda: (x) => x>2000&&x<=2100,
            max_lambda: (x) => x>2000&&x<=2100
        }
        this.handleChange=this.handleChange.bind(this);
    }
    handleChange(evt){
        const name = evt.target.name;
        try{
            const val = Number(evt.target.value);
            console.log(val)
                this.setState({[name]: val});
        }
        catch(err) {
            console.error(err);
        }
    }
    render(){
        return(
            <div className='temp-controller' id = {this.props.id}>
                <div className='instrument-label-readout' id='temp-controller-temp'>
                    <label className='instrument-label'>Min Wavelength</label>
                    <AdjustableDigitalReadout parent={this} name="min_lambda" increment={0.5} state_to_mod='min_lambda' unit='cm-1' min={2000} max={2100} digits={7} onChange={this.handleChange}></AdjustableDigitalReadout>
                    <label className='instrument-label'>Max Wavelength</label>
                    <AdjustableDigitalReadout parent={this} name="max_lambda" increment={0.5} state_to_mod='max_lambda' unit='cm-1' min={2000} max={2100} digits={7} onChange={this.handleChange}></AdjustableDigitalReadout>
                </div>
            </div>
        )
    }
}