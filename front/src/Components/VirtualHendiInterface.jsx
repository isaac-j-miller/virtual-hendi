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
        const url = `https://bo5s06dtdj.execute-api.us-east-1.amazonaws.com/default/${params.temperature}/${params.min_lambda}/${params.max_lambda}`;
        console.log("requesting spectrum");
        this.setState({loadingSpectrum:true});
        axios.get(url).then(resp1=>{
            const urlToUse = resp1.data.url;
            axios.get(urlToUse).then(resp=>{
                const spectrum = resp.data;
                console.log("received spectrum");
                this.setState({spectrum, loadingSpectrum:false});
            })
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
                        <Instructions></Instructions>
                    </div>
                    
                </div>
        )
    }
}