# Virtual HENDI spectrometer
This web app is intended to provide users with an overview of the anatomy of a Helium Nanodroplet Isolation Spectrometer and to allow users to experiment with changing parameters such as the nozzle temperature to better understand the effect of these parameters on the spectra collected by the instrument. The user can simulate collecting spectra at a variety of nozzle temperatures ranging between 13.5 and 20 K.

A demo of this application is currently hosted at [https://virtual-hendi.isaac-j-miller.com](https://virtual-hendi.isaac-j-miller.com).

# Usage
In order to view a tooltip about a component of the instrument, hover your mouse over it. In order to view inside the instrument, click the "See inside the instrument" button in the top right corner.
To run a spectrum, specify the wavelength range and the temperature using the controls and then click the "Run Spectrum" button. A spectrum should appear after a few seconds. If you wish to change the parameters, do so and then click "Run Spectrum" again, as it does not update automatically. Once the spectrum is loaded, you may download the spectrum as a .csv file.
You may interact with the spectrum in a few ways:
 - Zoom in on a section by pressing down the left mouse button, dragging across the section, and then releasing.
 - Scrub the spectrum by pressing down the left mouse button and dragging across the spectrum while pressing the "shift" key
 - Reset the view by double-clicking on the spectrum.

# Running locally
To run the application locally, after cloning the repository, cd into the root directory and run `scripts/check-env`. This ensures that all the necessary tools are installed. Then, run `scripts/watch`. This builds the frontend and starts the dev server, which listens on port 3000. Once this script is running, you may visit the site locally at [http://localhost:3000](http://localhost:3000). 
If you make changes while running the site in this way, nodemon will automatically rebuild.
If running in a non-ubuntu environment, you may have to make changes to the `scripts/check-env` script, as it uses `apt` to install the necessary packages. The script does the following:
- install nodejs, npm, and Python3.8
- cd into `front` and run `npm install` to install the node modules there
- cd into `dev` and run `npm install` to install the node modules there
- install python modules using `python -m pip install requirements.txt`, where `requirements.txt` is in `interpolator`
Also, if running on windows, be sure to use [git bash](https://gitforwindows.org/), rather than powershell or cmd.

# Architecture
This project was originally hosted on an EC2 virtual server, but that was expensive to host. The new architecture is the following:
The frontend is hosted as a static website in AWS s3 and distributed using AWS cloudfront, and the interpolator python function is now an AWS lambda function

# Contribute
Any contributions are welcome! I wrote this app fairly quickly as a favor for the [Raston Lab at JMU](https://www.jmu.edu/chemistry/people/all-people/faculty/raston-paul.shtml), so there are plenty of improvements/optimizations that can be done! The ones I can think of are as follow, in no particular order:
- refactor the javascript code to use typescript
- use prettier/eslint to automatically format files
- split `interpolator/handler.py` into modules and figure out how to make this work with AWS lambda (the code was originally written in such a way that classes were in individual files, as they should be, but this doesn't seem to work well when uploaded as a lambda function)
- move the base OCS spectrum files (in `interpolator/spectra`) to S3 and adjust the code in `interpolator/handler.py` accordingly
- make this work with other molecules than OCS (would require data for molecules other than OCS)
- add a title page or something that appears when the page is opened to explain the purpose of the site
- make the app more mobile friendly
- make the size of the spectrum adjust correctly (it doesn't fill the whole horizontal space it has)

If you have any questions about contributing, or about the site/project in general, please don't hesitate to email me at <miller.isaac96@gmail.com>

# Pull Requests
If you would like to make changes to this repo, please submit a pull request. I will review it in as timely a manner as possible, and since there is an automated deploy pipeline set up now, changes will be reflected within several minutes of merging the pull requests.

