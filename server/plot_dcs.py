# -*- coding: utf-8 -*-
import h5py
import simplejson
import os
import numpy as np
#import matplotlib.pyplot as plt
from time import time

def Elam(lam):
    """
    convert wavelength in angstroms to energy in meV
    """
    return 81.81/lam**2

def Ek(k):
    """
    convert wave-vector in inver angstroms to energy in meV
    """
    return 2.072*k**2

def kE(E):
    return np.sqrt(E/2.072)

def Qfunc(ki, kf, theta):
    """
    evaluate the magnitude of Q from ki, kf, and theta
    theta is the angle between kf and ki, sometimes called 2 theta, units of degrees
    """
    return np.sqrt(  ki**2 + kf**2 - 2*ki*kf*np.cos(theta*np.pi/180)  )

def Ef_from_timechannel(timeChannel, t_SD_min, speedRatDenom, masterSpeed):
    """
    using the parameters
        t_SD_min = minimum sample to detector time
        speedRatDenom = to set FOL chopper speed
        masterSpeed = chopper speed (except for FOL chopper)
    using the variabl
        timeChannel, where I am numbering from 1 <be careful of this convention>
    """
    return 8.41e7 / (t_SD_min + (timeChannel+1)*    (6e4 *(speedRatDenom/masterSpeed))   )**2

def process_raw_dcs(data_path):
    # t0 = time()
    os.chdir(data_path) # change working directory
    detInfo = np.genfromtxt('dcs_detector_info.txt', skip_header=1, skip_footer=17)
    detToTwoTheta = detInfo[:,9] # 10th column


    os.system('gzip -dc livedata.dcs.gz > livedata.dcs')
    #os.system('C:\\Software\\Octave-3.6.4\\bin\\octave --eval "load livedata.dcs; save -hdf5 livedata.hdf;"')
    os.system('octave --eval "load livedata.dcs; save -hdf5 livedata.hdf;"') 
    f = h5py.File('livedata.hdf')
    data = f['histodata']['value'].value

    ch_wl = f['ch_wl']['value'].value
    Ei = Elam(ch_wl)
    ki = kE(Ei)
    dE =0.5*(-0.10395+0.05616 *Ei+0.00108 *Ei**2) #take the putative resolution and halve it
    masterSpeed = f['ch_ms']['value'].value
    speedRatDenom = f['ch_srdenom']['value'].value
    t_SD_min = f['tsdmin']['value'].value

    Q_max = Qfunc(ki,ki,150)
    Q_min = 0
    E_bins = np.linspace(-Ei, Ei, int(2*Ei/dE) )
    Q_bins = np.linspace(Q_min,Q_max,301)

    #for every point in {timechannel, detectorchannel} space, map into a bin of {E,Q} space
    #remember, data is organized as data[detectorchannel][timechannel]
    i,j = np.indices(data.shape)
    ef = Ef_from_timechannel(j, t_SD_min, speedRatDenom, masterSpeed)
    Q_ = Qfunc(ki, kE(ef), detToTwoTheta[:, None])

    E_transfer = Ei-ef
    E_mask = (E_transfer > -Ei)

    EQ_data, xedges, yedges = np.histogram2d(Q_[E_mask], E_transfer[E_mask], bins=(Q_bins, E_bins), range=([Q_min,Q_max], [-Ei, Ei]), weights=data[E_mask])


    stop_date = ''.join(chr(a) for a in f['stop_date']['value'].value.flatten())
    start_date = ''.join(chr(a) for a in f['start_date']['value'].value.flatten())
            
    output = {
        "title": "DCS snapshot",
        "dims": {
            "ymin": -Ei,
            "ymax": Ei,
            "ydim": EQ_data.shape[1],
            "xmin": 0,
            "xmax": Q_max,
            "xdim": EQ_data.shape[0],
            "zmin": EQ_data.min(),
            "zmax": EQ_data.max()
        },
        "type": "2d",
        "ylabel": "Ei-Ef [meV]",
        "xlabel": "|Q| [Å⁻¹]",
        "z": [EQ_data.T.tolist()],
        "options": {},
        "metadata": {
            "stop_date": stop_date,
            "start_date": start_date
        }
    }

    #print time()-t0
    return simplejson.dumps([output])


