import React, {Component} from 'react'
import '../Style/AdjustableDigitalReadout.css'
export default class AdjustableDigitalReadout extends Component{
    constructor(props){
        super(props);
        this.increment=this.increment.bind(this);
        this.decrement=this.decrement.bind(this);
    }
    increment(){
        if(this.props.parent.state[this.props.state_to_mod]+this.props.increment<=this.props.max){
            this.props.parent.setState({[this.props.state_to_mod]:this.props.parent.state[this.props.state_to_mod]+this.props.increment});
        }
    }
    decrement(){
        if(this.props.parent.state[this.props.state_to_mod]-this.props.increment>=this.props.min){
            this.props.parent.setState({[this.props.state_to_mod]:this.props.parent.state[this.props.state_to_mod]-this.props.increment});
        }
    }
    render(){
        let val = String(Number(this.props.parent.state[this.props.state_to_mod]).toFixed(2)).padStart(this.props.digits || 6,'0')
        return (
            <div id={this.props.id} className={this.props.className + ' digital-readout-adjustable'}>
                <input className='digital-readout' name={this.props.name} value={val} unit={this.props.unit} digits={this.props.digits || 6} onChange={this.props.onChange} style={{width: `${((this.props.digits || 6)+1)/2}em`}}/>
                <label className='digital-readout'>{this.props.unit}</label>
                <div className='button-container'>
                    <button onClick={this.increment}>+</button>
                    <button onClick={this.decrement}>-</button>
                </div>
            </div>
        )
    }
}