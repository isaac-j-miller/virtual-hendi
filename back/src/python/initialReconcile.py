import interpolation
import os
path = '/home/millerij/Documents/github/virtual-hendi/back/spectra'
files = [os.path.join(path, f) for f in os.listdir(path) if f[-3:]=='dat']
interpolation.util.reconcileAndReplace(*files)