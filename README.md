# Virtual HENDI spectrometer
This web app is intended to provide users with an overview of the anatomy of a Helium Nanodroplet Isolation Spectrometer and to allow users to experiment with changing parameters such as the nozzle temperature to better understand the effect of these parameters on the spectra collected by the instrument. The user can simulate collecting spectra at a variety of nozzle temperatures ranging between 13.5 and 20 K.

This application is currently hosted at [http://virtual-hendi.isaac-j-miller.com](http://virtual-hendi.isaac-j-miller.com).

# Usage
In order to view a tooltip about a component of the instrument, hover your mouse over it. In order to view inside the instrument, click the "See inside the instrument" button in the top right corner.
To run a spectrum, specify the wavelength range and the temperature using the controls and then click the "Run Spectrum" button. A spectrum should appear after a few seconds. If you wish to change the parameters, do so and then click "Run Spectrum" again, as it does not update automatically. Once the spectrum is loaded, you may download the spectrum as a .csv file.
You may interact with the spectrum in a few ways:
 - Zoom in on a section by pressing down the left mouse button, dragging across the section, and then releasing.
 - Reset the view by double-clicking on the spectrum.

# Running locally
To run the application locally, after cloning the repository, cd into the root directory (i.e. `virtual-hendi/`) and run `scripts/check-env`. This ensures that all the necessary tools are installed. Then, run `scripts/start-local`. This builds the frontend and starts the server, which listens on port 3000. Once this script is running, you may visit the site locally at [http://localhost:3000](http://localhost:3000). 
If you make changes to the front end while running the site in this way, you must re-build the frontend by running `scripts/rebuild-front`.
If running in a non-ubuntu environment, you may have to make changes to the `scripts/check-env` script, as it uses `apt` to install the necessary packages. The script does the following:
- install Python 3.8
- create a virtual environment in `back/src/python/env`
- activate `env`
- install python modules using `python -m pip install requirements.txt`, where `requirements.txt` is in `back/src/python`
- install nodejs, npm
- cd into `front` and run `npm install` to install the node modules there
- cd into `back` and run `npm install` to install the node modules there
Also, if running on windows, be sure to use [git bash](https://gitforwindows.org/), rather than powershell or cmd.

# Running on a server
This application requires Ubuntu 20.04 to run. An older or newer version might work, but it has only been tested on 20.04. After instantiating the server, run scripts/user-data in the # directory (`sudo -i`). Since the repo has not been cloned yet, you will need to copy the contents of this script to the server and then run it. This script clones the repo and configures the server to host the site. It configures nginx to listen on port 80 and redirect traffic to port 3000 so that the web app can be accessed from the server's public IP.
To update the version on the server, ssh into the server and `sudo -i`. Then run `scripts/update-reload`. I have had some issues with the process not properly stopping, so it may be necessary to determine the PID of the process using port 3000 and manually kill it before running `scripts/update-reload`.
