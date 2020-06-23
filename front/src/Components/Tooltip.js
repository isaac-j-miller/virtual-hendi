import React, {Component} from 'react'
import '../Style/Tooltip.css'
export default class Tooltip extends Component{
    constructor(props){
        super(props);
        this.props=props;
        this.updatePosition=this.updatePosition.bind(this);
        this.state = {
            position:{
                top:0,
                left:0,
            }
        }
        document.onmousemove = event=>{
            this.setState({position:{
                top:event.clientY,
                left:event.clientX
            }})
        };
        
    }
    updatePosition(event){
        if(this.props.visible){
            console.log(event);
        }
    }
    render(){
        if(this.props.visible){
            return(
                <div className='tooltip' style={this.state.position}>
                    <label>{this.props.header}</label>
                    {this.props.text}
                </div>
            )
        }
        else{
            return <div/>
        }
    }
}