# I hope to put many things here

from math import *

# RF stuff
def s_to_abcd(s11,s12,s21,s22):# https://www.slideserve.com/melania/chapter-2-network-parameters, https://www.slideserve.com/nami/lecture-6, https://empossible.net/wp-content/uploads/2018/03/IEEETransMTT_v42_n2_p205-Parameter-Conversion-Tables.pdf
	a=(0.5/s21)*((1+s11)*(1-s22)+s12*s21)
	b=(0.5/s21)*50*((1+s11)*(1+s22)-s12*s21)
	c=(0.5/s21)*(1/50)*((1-s11)*(1-s22)-s12*s21)
	d=(0.5/s21)*((1-s11)*(1+s22)+s12*s21)
	return [a,b,c,d]

def stability_factor(s11,s12,s21,s22):
	det = s11*s22 - s12*s21
	return (1 - abs(s11)**2 - abs(s22)**2 + abs(det)**2) / (2*abs(s12)*abs(s21))

swr = lambda r: (1+abs(r))/(1-abs(r))
reflection = lambda z,z0: (z-z0)/(z+z0)
mag_phase_deg = lambda m,d: m*e**(1j*d*pi/180)
reflection_to_z = lambda r,z0: z0*(1+r)/(1-r)
