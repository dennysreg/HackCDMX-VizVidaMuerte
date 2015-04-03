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

def getEgresos():		
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
	nacimientos['month'] = nacimientos['time'].map(lambda x: x.month)

	defunciones['time'] = defunciones['egreso'].astype('datetime64')
	defunciones['yearmonth'] =  defunciones['time'].map(lambda x: x.year*100 + x.month)
	defunciones['year'] = defunciones['time'].map(lambda x: x.year)
	defunciones['month'] = defunciones['time'].map(lambda x: x.month)

	
	dict_years = {}
	for year in [2011, 2012]:		
		df_subset_nacimientos = nacimientos[nacimientos['year'] == year]
		df_subset_defunciones = defunciones[defunciones['year'] == year]

		
		dict_hospitales = {}
		#acum = 0
		meses = ["","enero", "febrero", "marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]
		dict_meses = {}
		for mes in range(1, len(meses)):		
			
			df = df_subset_defunciones[df_subset_defunciones['year'] == year][df_subset_defunciones['month']== mes] 
			df2 = df_subset_nacimientos[df_subset_nacimientos['year'] == year][df_subset_nacimientos['month']== mes] 
			
			for hospital in lista_hospitales:
				ds = df[df['clues_id'] == hospital]
				num_defunciones = len(ds.index)
				
				ds = df2[df2['clave_hospital'] == hospital]		
				num_nacimientos = len(ds.index)
				#dict_cat = dict_cords[hospital]			
				dict_hospitales[hospital] =  {"nacimientos": num_nacimientos , "defunciones": num_defunciones}

				#{"defunciones" : {"children" : lista_defunciones}, "nacimientos" : {"children" : lista_nacimientos}}
			dict_meses[meses[mes]] = dict_hospitales.copy()
		dict_years[year] = dict_meses

	json_format_data = json.dumps(dict_years)
	return json_format_data




	
if __name__ == '__main__':
	print getEgresos()
	#print getData('1','2')
	#print scatterPlotData()
	#print timeLineData('2013')
