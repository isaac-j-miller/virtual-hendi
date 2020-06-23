import React, {Component} from 'react'
import '../Style/DigitalReadout.css'
export default class DigitalReadout extends Component{
    render(){
        return (
            <div id={this.props.id} className={this.props.className}><label className='digital-readout'>{String(Number(this.props.number).toFixed(2)).padStart(6,'0')} {this.props.unit}</label></div>
        )
    }
}