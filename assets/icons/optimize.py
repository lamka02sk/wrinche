from svgoptimizer import CleanSVG
import os
from os import path


def clean(file):
	input_file = os.path.join("default", file)
	output_file = file
	svg = CleanSVG(input_file)
	svg.removeAttribute('id')
	svg.removeAttribute('version')
	svg.setDecimalPlaces(1)
	svg.removeElement('title')
	svg.removeElement('desc')
	svg.removeElement('defs')
	svg.removeElement('namedview')
	svg.removeElement('metadata')
	svg.removeNamespace('sodipodi')
	svg.removeNamespace('inkscape')
	svg.removeNamespace('xmlns')
	svg.removeComments()
	svg.applyTransforms()
	svg.write(output_file)

files = [x for x in os.listdir('default') if path.isfile('default'+os.sep+x)]
for x in files:
	clean(x)
