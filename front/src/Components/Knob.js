import React, {Component} from 'react'
import '../Style/Knob.css'

export default class Knob extends Component{
    constructor(props){
        super(props);
        this.handleDrag=this.handleDrag.bind(this);
        this.props = props;
        this.state={
            step:1,
            ...props
        }
    }
    handleDrag(event){
        event.preventDefault();
        console.log(event);
        console.log(event.movementX, event.movementY);
    }
    render(){
        return <div className='knob' onDrag={this.handleDrag}></div>
    }
}