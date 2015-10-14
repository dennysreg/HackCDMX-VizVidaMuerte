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

def set_default(obj):    
    if isinstance(obj, numpy.int64):
        return  obj.astype(numpy.int32)    
    raise TypeError

def getEgresos():		
	#"""A partir de un mes-año regresa los registros de defunciones y nacimientos aplicando ese filtro"""
	cords = pd.read_csv('../limpieza/output/delegaciones_coords.csv')
	defunciones = pd.read_csv('../limpieza/output/defunciones_filtrado.csv')
	nacimientos = pd.read_csv('../limpieza/output/nacimientoshospitalarios_filtrado.csv')
	#print nacimientos.columns
	#sys.exit(0)
	dict_cords = {}

	lista_hospitales = defunciones['clues_id'].unique().tolist()		
	
	dict_cords = {}
	#almacena en un diccionario el catalogo de hospitales
	for index, row in cords.iterrows():
		dict_cords[row['id'] ] = {"nombre": row['hospital'], "longitud" : row['longitud'], "latitud" : row['latitud'], "id" : row['id_delegacion'], "delegacion" : row['delegacion']}

	#crea campos fecha para nacimientos
	nacimientos['time'] = nacimientos['egreso'].astype('datetime64')
	nacimientos['yearmonth'] =  nacimientos['time'].map(lambda x: x.year*100 + x.month)
	nacimientos['year'] =  nacimientos['time'].map(lambda x: x.year)
	nacimientos['month'] = nacimientos['time'].map(lambda x: x.month)

	#crea campos fecha para nacimientos
	defunciones['time'] = defunciones['egreso'].astype('datetime64')
	defunciones['yearmonth'] =  defunciones['time'].map(lambda x: x.year*100 + x.month)
	defunciones['year'] = defunciones['time'].map(lambda x: x.year)
	defunciones['month'] = defunciones['time'].map(lambda x: x.month)

	#se quda fuera el 2010 y en 2012 falta el mes de diciembre
	dict_years = {}
	meses = ["","enero", "febrero", "marzo","abril","mayo","junio","julio","agosto","septiembre","octubre","noviembre","diciembre"]

	dict_hospitales = {}

	for hospital in lista_hospitales:
		dict_years = {}
		for year in [2011, 2012]:
			dict_months = {}
			for mes in range(1, len(meses)):
				df = defunciones[defunciones['year'] == year][defunciones['month'] == mes] 
				df2 = nacimientos[nacimientos['year'] == year][nacimientos['month'] == mes] 
				ds = df[df['clues_id'] == hospital]
				num_defunciones = len(ds.index)
				
				ds = df2[df2['clave_hospital'] == hospital]		
				ds_vivos = ds[ds['condicion_nacimiento']!='MUERTE FETAL']

				groupBySex = ds_vivos[['hospital','sexo']].groupby('sexo').count()
				nacidos_vivos = groupBySex['hospital'].sum()

				dict_row = groupBySex.to_dict()['hospital']
				
				num_nacimientos = len(ds.index)
				#groupByCondicion = ds[['hospital','condicion_nacimiento']].groupby('condicion_nacimiento').count()
				dict_row.update({'NO VIVOS': num_nacimientos - nacidos_vivos})
				
				
				#dict_cat = dict_cords[hospital]
				#mezcla ambos diccionarios
				dict_row.update({"nacimientos": num_nacimientos , "defunciones": num_defunciones})			
				dict_months[mes] =  dict_row
			dict_years[year] =  dict_months.copy()
		dict_hospitales[hospital] = dict_years

	json_format_data = json.dumps(dict_hospitales, default=set_default)
	return json_format_data




	
if __name__ == '__main__':
	print getEgresos()
