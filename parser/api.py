# -*- coding: iso-8859-15 -*-
import numpy
import pandas as pd
import json
import sys
import os
import time
import datetime
from itertools import izip
import dateutil
from random import randint

def welcome():
	return 'pa diuxhi'

def getEgresos(yearmonth):		
	#"""A partir de un mes-año regresa los registros de defunciones y nacimientos aplicando ese filtro"""
	cords = pd.read_csv('../ds/delegaciones_coords.csv')
	defunciones = pd.read_csv('../limpieza/output/defunciones_filtrado.csv')
	nacimientos = pd.read_csv('../limpieza/output/nacimientoshospitalarios_filtrado.csv')
	dict_cords = {}
	lista_hospitales = defunciones['clues_id'].unique().tolist()		
	
	dict_cords = {}
	#print cords.describe()
	for index, row in cords.iterrows():
		dict_cords[row['id'] ] = {"nombre": row['hospital'], "longitud" : row['longitud'], "latitud" : row['latitud'], "id" : row['id_delegacion'], "delegacion" : row['delegacion']}

	
	#sys.exit(0)
	#	print lista_hospitales
	nacimientos['time'] = nacimientos['egreso'].astype('datetime64')
	nacimientos['yearmonth'] =  nacimientos['time'].map(lambda x: x.year*100 + x.month)
	nacimientos['year'] =  nacimientos['time'].map(lambda x: x.year)

	defunciones['time'] = defunciones['egreso'].astype('datetime64')
	defunciones['yearmonth'] =  defunciones['time'].map(lambda x: x.year*100 + x.month)
	defunciones['year'] = defunciones['time'].map(lambda x: x.year)

	yearmonth = int(yearmonth)
	year = 2012
	df_subset_nacimientos = nacimientos[nacimientos['year'] == year]
	df_subset_defunciones = defunciones[defunciones['year'] == year]

	
	dict_hospitales = {}
	#acum = 0
	for hospital in lista_hospitales:
		df = df_subset_defunciones[df_subset_defunciones['clues_id'] == hospital]		
		#new_fecha.strftime("%Y-%m-%dT%H:%M:%S")
		num_defunciones = len(df.index)
	
		df = df_subset_nacimientos[df_subset_nacimientos['clave_hospital'] == hospital]		
		num_nacimientos = len(df.index)

		dict_cat = dict_cords[hospital]
		
		dict_hospitales[dict_cat['nombre']] =  [dict_cat['longitud'], dict_cat['latitud'], "boardings", num_nacimientos, "rank", 1, "departures",num_defunciones, "rank", 1]
		#{"defunciones" : {"children" : lista_defunciones}, "nacimientos" : {"children" : lista_nacimientos}}
	
	json_format_data = json.dumps(dict_hospitales)
	return json_format_data




	
if __name__ == '__main__':
	print getEgresos('201210')
	#print getData('1','2')
	#print scatterPlotData()
	#print timeLineData('2013')
