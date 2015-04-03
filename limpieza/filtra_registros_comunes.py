"""Filtra los los datasets de nacimientos y defunciones, manteniendo los rows que pertenecen a un hospital en comun """

import pandas as pd
import sys
import json


def main():
	#encuentra la lista de hospitales en comun
	df_def = pd.read_csv('../ds/defunciones.csv')
	df_nac = pd.read_csv('../ds/nacimientoshospitalarios.csv')
	cve_hosp_def = df_def['clues_id'].unique().tolist()
	cve_hosp_nac = df_nac['clave_hospital'].unique().tolist()
	cve_hosp_com = []
	for i in cve_hosp_def:
		for j in cve_hosp_nac:
			if i == j:
				cve_hosp_com.append(i)

	df_def_filtrado = df_def[df_def['clues_id'].isin(cve_hosp_com)]
	df_nac_filtrado = df_nac[df_nac['clave_hospital'].isin(cve_hosp_com)]
	df_def_filtrado.to_csv('./output/defunciones_filtrado.csv')
	df_nac_filtrado.to_csv('./output/nacimientoshospitalarios_filtrado.csv')


if __name__ == '__main__':
	main()