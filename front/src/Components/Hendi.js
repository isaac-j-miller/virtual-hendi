import React, {Component} from 'react'
import '../Style/Hendi.css'
import Tooltip from './Tooltip';
export default class Hendi extends Component{
    constructor(props){
        super(props);
        this.props = props;
        this.test=this.test.bind(this);
        this.getMapBorders=this.getMapBorders.bind(this);
        this._isMounted=false;
        this.state={
            bg:true,
            fg:true,
            ch:true,
            stark:true,
            quad:true,
            laserbeam:true,
            canister:true,
            activeToolTipHeader:'',
            activeToolTipText:'',
            toolTipActive:false
        }
        
    }
    componentDidMount(){
        this._isMounted=true;
        this.getMapBorders(0,0,100,100, 'ch_area');
    }
    hideForeground(){
        this.setState({
            fg:false,
            canister:false
        })
    }
    showForeground(){
        this.setState({
            fg:true,
            canister:true
        })
    }
    setActiveTooltip(tooltip){
        const tooltips = {
            detection:{
                header: 'Detection Chamber',
                text:<p>This chamber contains the mass spectrometer and often has pressures as low as 10<sup>-11</sup> Torr.</p>
            },
            doping:{
                header: 'Doping Chamber',
                text:<p>This chamber is where the analyte molecules condense into the molecular beam.</p>
            },
            source:{
                header: 'Source Chamber',
                text:<p>This is where the Helium droplets are formed.</p>
            },
            coldhead:{
                header: 'Coldhead',
                text:<p>This is a large piece of copper which is cooled to a temperature of around 30 K by the cyclic evaporation and condensation of helium.</p>
            },
            stark:{
                header: 'Stark Cell',
                text:<p>The Stark cell consists of two mirror-polished steel plates that are used to generate an electric field of up to 75 kV/cm. The electric field affects the rotation of the analyte based on its dipole moment.</p>
            },
            quad:{
                header: 'Quadrupole mass spectrometer',
                text:<p>The mass spectrometer is used to measure the helium evaporated by the excitation and subsequent relaxation of the analyte due to the laser.</p>
            },
            laserbeam:{
                header: 'Infrared Laser',
                text:<p>The laser is used to excite the analyte at certain wavelengths, which causes the moleule to relax, transferring its energy to the helium surrounding it, causing some helium to evaporate.&nbsp;
                    This causes a decrease in the total ion signal from the mass spectrometer, which forms a spectrum when scanning across a range of wavelengths.</p>
            },
            canister:{
                header: 'Gas Cannister',
                text:<p>The analyte, in gas form, is stored here. It is leaked into the doping chamber via a leak valve</p>
            },
            skimmer:{
                header: 'Skimmer',
                text:<p>The spray of helium droplets are skimmed into a molecular beam, which then travels into the doping chamber</p>
            },
            nozzle:{
                header: 'Nozzle',
                text:<p>The helium gas, chilled from thermal contact with the coldhead, is ejected from the nozzle into vacuum (~10<sup>-5</sup> Torr), rapidly cooling the helium to 0.4 K, where it condenses into a superfluid.</p>
            },

        }
        this.setState({
            toolTipActive:true,
            activeToolTipHeader:tooltips[tooltip].header,
            activeToolTipText:tooltips[tooltip].text,
        })
        
    }
    test(){
        console.log('test')
    }
    getMapBorders(x1, y1, x2, y2, state){
        if(this._isMounted){
            const h = document.getElementById(this.props.id).clientHeight;
            const w = document.getElementById(this.props.id).clientWidth;
            console.log(w, h)
            const getX = x =>{
                return Number(w)*x/100;
            }
            const getY = Y =>{
                return Number(h)*Y/100;
            }
            this.setState({[state]:`${getX(x1)},${getY(y1)},${getX(x2)},${getY(y2)}`}) 
        }
        else{
            setTimeout(this.getMapBorders,100,[x1,y1,x2,y2])
        }
        
        
    }
    getToolTipAreas(){
        const areas = {
            detection:<div className='area-div' id="hendi-detection-clickable" onMouseEnter={()=>{this.setActiveTooltip('detection')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            doping:<div className='area-div' id="hendi-doping-clickable" onMouseEnter={()=>{this.setActiveTooltip('doping')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            source:<div className='area-div' id="hendi-source-clickable" onMouseEnter={()=>{this.setActiveTooltip('source')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            ch:<div className='area-div' id="hendi-ch-clickable" onMouseEnter={()=>{this.setActiveTooltip('coldhead')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            stark:<div className='area-div' id="hendi-stark-clickable" onMouseEnter={()=>{this.setActiveTooltip('stark')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            quad:<div className='area-div' id="hendi-quad-clickable" onMouseEnter={()=>{this.setActiveTooltip('quad')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            laserbeam:<div className='area-div' id="hendi-laserbeam-clickable" onMouseEnter={()=>{this.setActiveTooltip('laserbeam')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            canister:<div className='area-div' id="hendi-canister-clickable" onMouseEnter={()=>{this.setActiveTooltip('canister')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            skimmer:<div className='area-div' id="hendi-skimmer-clickable" onMouseEnter={()=>{this.setActiveTooltip('skimmer')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
            nozzle:<div className='area-div' id="hendi-nozzle-clickable" onMouseEnter={()=>{this.setActiveTooltip('nozzle')}} onMouseLeave={()=>{this.setState({toolTipActive:false})}}></div>,
        }
        let areasToKeep = [];
        let divsToRender = [];
        if(this.state.fg){
            areasToKeep = areasToKeep.concat(['detection','doping', 'source','canister'])
        }
        else{
            areasToKeep = areasToKeep.concat(['ch','quad','laserbeam','skimmer','nozzle', 'stark'])
        }
        areasToKeep.forEach(elem=>{
            divsToRender.push(areas[elem])
        })
        return divsToRender.map(elem=>elem);
    }
    render(){
        return (
            <div className='hendi-box' id={this.props.id}>
                <img className={`hendi-component ${this.state.bg?'':'transparent'}`} id='hendi-bg' src='/hendi-background.png'/>
                <img className={`hendi-component ${this.state.fg?'':'transparent'}`} id='hendi-fg' src='/hendi-foreground.png'/>
                <img className={`hendi-component ${this.state.ch?'':'transparent'}`} id='hendi-ch' src='/hendi-coldhead.png'/>
                <img className={`hendi-component ${this.state.stark?'':'transparent'}`} id='hendi-stark' src='/hendi-stark.png'/>
                <img className={`hendi-component ${this.state.quad?'':'transparent'}`} id='hendi-quad' src='/hendi-quad.png'/>
                <img className={`hendi-component ${this.state.laserbeam?'':'transparent'}`} id='hendi-laserbeam' src='/hendi-laserbeam.png'/>
                <img className={`hendi-component ${this.state.canister?'':'transparent'}`} id='hendi-ocs-canister' src='/hendi-ocs-canister.png' useMap='hendi-map'/>
                <Tooltip header={this.state.activeToolTipHeader} text={this.state.activeToolTipText} visible={this.state.toolTipActive}></Tooltip>
                {this.getToolTipAreas()}
            </div>
        )
    }
}