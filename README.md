# Virtual HENDI spectrometer
This web app is intended to provide users with an overview of the anatomy of a Helium Nanodroplet Isolation Spectrometer and to allow users to experiment with changing parameters such as the nozzle temperature to better understand the effect of these parameters on the spectra collected by the instrument. The user can simulate collecting spectra at a variety of nozzle temperatures ranging between 13.5 and 20 K.

This application is currently hosted at [http://virtual-hendi.isaac-j-miller.com](http://virtual-hendi.isaac-j-miller.com).

# Usage
In order to view a tooltip about a component of the instrument, hover your mouse over it. In order to view inside the instrument, click the "See inside the instrument" button in the top right corner.
To run a spectrum, specify the wavelength range and the temperature using the controls and then click the "Run Spectrum" button. A spectrum should appear after a few seconds. If you wish to change the parameters, do so and then click "Run Spectrum" again, as it does not update automatically. Once the spectrum is loaded, you may download the spectrum as a .csv file.
You may interact with the spectrum in a few ways:
 - Zoom in on a section by pressing down the left mouse button, dragging across the section, and then releasing.
 - Reset the view by double-clicking on the spectrum.
