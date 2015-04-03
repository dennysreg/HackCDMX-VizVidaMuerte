from flask import Flask, url_for
import api

try:
	from flask.ext.cors import CORS
except ImportError:
	import os
	parentdir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
	os.sys.path.insert(0, parentdir)

	from flask.ext.cors import CORS

app = Flask(__name__)
cors = CORS(app)

@app.route('/articles')
def api_articles():
	return 'List of ' 

@app.route('/')
def api_root():
	return api.welcome()        
	#return 'Welcome'

@app.route('/egresos/<id>')
def api_egresos(id):	
	return api.getEgresos('201210')
	#return 'List of ' + url_for('api_articles')

#@app.route('/arbol/<id>')
#def api_arbol(id):	
#	return api.getData('1', id)

#@app.route('/pack/<id>')
#def api_pack(id):	
#	return api.getData('2', id)

#@app.route('/analysis')
#def api_analysis():
#	return api.scatterPlotData()

#@app.route('/time/<year>')
#def api_time(year):
#	return api.timeLineData(year)

if __name__ == '__main__':
	app.config['CORS_HEADERS'] = 'Content-Type'
	app.run(host='0.0.0.0')
