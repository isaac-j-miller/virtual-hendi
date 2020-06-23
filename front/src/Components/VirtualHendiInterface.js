import React, {Component} from 'react'
import Hendi from './Hendi';
import DigitalReadout from './DigitalReadout';
import '../Style/VirtualHendiInterface.css'
import TemperatureController from './TemperatureController'

export default class VirtualHendiInterface extends Component{
    constructor(props){
        super(props);
        this.props = props;
        this.hendiRef=React.createRef();
        this.hideForeground=this.hideForeground.bind(this);
        this._isMounted=false;
        this.state={
            fgState:true,
            toggleFgTitle:'See Inside the Instrument'
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
    render(){
        return (
            <div id='main-virtual-hendi-interface-container'>
                <Hendi id='hendi-instrument' ref={this.hendiRef}/>
                <div id='control-box'>
                    <button onClick={this.hideForeground}>{this.state.toggleFgTitle}</button>
                    <TemperatureController id='temperature-controller' parent={this}/>
                </div>
            </div>
        )
    }
}