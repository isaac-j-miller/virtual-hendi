import React, {Component} from 'react'
import DigitalReadout from './DigitalReadout'
import '../Style/AdjustableDigitalReadout.css'
export default class AdjustableDigitalReadout extends Component{
    constructor(props){
        super(props);
        this.props=props;
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
        return (
            <div id={this.props.id} className={this.props.className + ' digital-readout-adjustable'}>
                <DigitalReadout number={this.props.parent.state[this.props.state_to_mod]} unit={this.props.unit}/>
                <div className='button-container'>
                    <button onClick={this.increment}>+</button>
                    <button onClick={this.decrement}>-</button>
                </div>
            </div>
        )
    }
}