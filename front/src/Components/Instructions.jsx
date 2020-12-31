import React from 'react'
import '../Style/Instructions.css'

const Instructions = props => {
    return <div className="box">
            <h1 className="instructions">Usage</h1>
            <p>
                In order to view a tooltip about a component of the instrument, hover your mouse over it. In order to view inside the instrument, click the "See inside the instrument" button in the top right corner. To run a spectrum, specify the wavelength range and the temperature using the controls and then click the "Run Spectrum" button. A spectrum should appear after a few seconds. If you wish to change the parameters, do so and then click "Run Spectrum" again, as it does not update automatically. Once the spectrum is loaded, you may download the spectrum as a .csv file. You may interact with the spectrum in a few ways: Zoom in on a section by pressing down the left mouse button, dragging across the section, and then releasing. Scrub the spectrum by pressing down the left mouse button and dragging across the spectrum while pressing the "shift" key.Reset the view by double-clicking on the spectrum.
            </p>
        </div>
}
export default (Instructions());
