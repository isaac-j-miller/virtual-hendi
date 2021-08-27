import React from 'react'
import '../Style/VirtualHendiInterface.css'

const Spinner = props => {
    return <div className="spinner-container">
            <img src="/virtual-hendi/logo512.png" className="spinner" alt="spinner"/>
            <label>Loading...</label>
        </div>
}
export default Spinner;