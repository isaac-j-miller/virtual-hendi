import React, {Component} from 'react'
import Hendi from './Hendi';
import '../Style/VirtualHendiInterface.css'
import TemperatureController from './TemperatureController'
import WavelengthController from './WavelengthController'
import Spinner from './Spinner'
import Spectrum from './Spectrum'
import axios from 'axios'
import Instructions from './Instructions';

export default class VirtualHendiInterface extends Component{
    constructor(props){
        super(props);
        this.props = props;
        this.hendiRef=React.createRef();
        this.tempRef=React.createRef();
        this.lambdaRef=React.createRef();
        this.hideForeground=this.hideForeground.bind(this);
        this._isMounted=false;
        this.state={
            fgState:true,
            toggleFgTitle:'See Inside the Instrument',
            spectrum:"",
            loadingSpectrum:false,
        }
    }
    componentDidMount(){
        this._isMounted=true;
    }
    hideForeground(){
        if(this._isMounted){
            if(this.state.fgState){
                this.hendiRef.current.hideForeground();
                this.setState({fgState:false, toggleFgTitle:'Toggle Instrument Transparency'})
            }
            else{
                this.hendiRef.current.showForeground();
                this.setState({fgState:true, toggleFgTitle:'See Inside the Instrument'})
            }
        }
    }
    getSpectrum() {
        const params = {
            ...this.tempRef.current.state,
            ...this.lambdaRef.current.state
        }
        console.log(params);
        const url = `${window.location.origin}/spectrum/${params.temperature}/${params.min_lambda}/${params.max_lambda}`;
        console.log("requesting spectrum");
        this.setState({loadingSpectrum:true});
        axios.get(url).then(resp=>{
            const spectrum = resp.data.data;
            console.log("received spectrum");
            this.setState({spectrum, loadingSpectrum:false});
        })
    }
    render(){
        return (
                <div id='main-virtual-hendi-interface-container'>
                    <Hendi id='hendi-instrument' ref={this.hendiRef}/>
                    <div id='control-box'>
                        <button onClick={this.hideForeground}>{this.state.toggleFgTitle}</button>
                        <TemperatureController id='temperature-controller' parent={this} ref={this.tempRef}/>
                        <WavelengthController id='wavelength-controller' parent={this} ref={this.lambdaRef}/>
                        <button onClick={this.getSpectrum.bind(this)}>Run Spectrum</button>
                        {this.state.loadingSpectrum? <Spinner/> : this.state.spectrum && <Spectrum data={this.state.spectrum}/>}
                    </div>
                    <div className="box">
                        <h1 className="header">Usage</h1>
                            <p className="instructions">
                            In order to view a tooltip about a component of the instrument, hover your mouse over it. In order to view inside the instrument, click the "See inside the instrument" button in the top right corner. To run a spectrum, specify the wavelength range and the temperature using the controls and then click the "Run Spectrum" button. A spectrum should appear after a few seconds. If you wish to change the parameters, do so and then click "Run Spectrum" again, as it does not update automatically. Once the spectrum is loaded, you may download the spectrum as a .csv file. You may interact with the spectrum in a few ways: Zoom in on a section by pressing down the left mouse button, dragging across the section, and then releasing. Scrub the spectrum by pressing down the left mouse button and dragging across the spectrum while pressing the "shift" key.Reset the view by double-clicking on the spectrum.
                            </p>
                    </div>
                </div>
        )
    }
}