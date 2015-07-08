

function visLineaTiempo(){
	this.width;
	this.height;
	this.margin;
	this.DOMid;
	this.classname;
	this.duracion;
	this.lineaTiempo = new LineaTiempo();

	this.linealargo;
	this.meseslargo;
	this.initLineaTiempo = function(anios,posicionMarcador){
		
		this.lineaTiempo.setInfo(anios,posicionMarcador);
	}

	this.initvisualizacion = function(DOMid,classname,w,h,duration){
		this.width = w;
		this.height = h;
		this.DOMid = DOMid;
		this.classname = classname;
		this.duracion = duration;

		this.initAnios(DOMid,this.lineaTiempo.anios,100);

		var svg = d3.select(DOMid)
				.append("svg")
				.attr("class","vis"+classname)
				.attr("width",w)
				.attr("height",h)
				.append("g")
				.attr("class",classname);
		
		
	}

	this.dovisualizacion = function(linealargo){
		var that = this;
		var lineaTiempo = this.lineaTiempo;
		this.meseslargo = linealargo / (lineaTiempo.mesestotales-1);
		this.linealargo = linealargo;

		
		this.setCurrentAnioBlack();

		var svg =  d3.select(".vis"+this.classname+" ."+this.classname)
					.attr("transform","translate("+this.width*.05+","+this.height*.50+")");

		/*dibuja la linea*/
		var grupoLinea = svg.append("g").attr("class","lalinea")
			.attr("transform","translate("+5+","+0+")");
		grupoLinea.append("line").attr("class","lineaPrincipal")
			.attr("x1",0)
			.attr("y1",0)
			.attr("x2",linealargo)
			.attr("y2",0);

		//lineas de meses
		meseslargo = linealargo / (lineaTiempo.mesestotales-1);
		for(var i=0;i<=lineaTiempo.mesestotales-1;i++){
			
			grupoLinea.append("line").attr("class","lineaMes")
				.attr("x1",meseslargo*i)
				.attr("y1",-10)
				.attr("x2",meseslargo*i)
				.attr("y2",10);

			grupoLinea.append("text")
				.attr("x",meseslargo*i)
				.attr("y",20)
				.text(lineaTiempo.meses[i]);
		}

		
		//set el posicionMarcador
		initMarcador(".vis"+this.classname+" ."+this.classname + " .lalinea","imgs/lineaDelTiempo/flecha.png",new Array(lineaTiempo.posicionMarcador),meseslargo);
		
		//set botones de bordes
		var infoposbotones = [{nombre:"botonRegresa",px:-40 			 ,py:-15 ,w:30, h:30, imgpath:"imgs/lineaDelTiempo/boton_paraAtras_"},
							  {nombre:"botonAvanza" ,px:linealargo+13,py:-15 ,w:30, h:30, imgpath:"imgs/lineaDelTiempo/boton_paraAdelante_"}]
		initBotonesDeLosLados(".vis"+this.classname+" ."+this.classname,infoposbotones,that);

		

		function initMarcador(DOMid,imgpath,data,meseslargo){
			var svg = d3.select(DOMid);
			
			var posicionMarcador = svg.selectAll(".marcador").data(data);
			posicionMarcador.enter().append("svg:image")
			.attr("xlink:href", imgpath)
			.attr("width",28)
			.attr("height",28)
			.attr("class","marcador")
			.attr("transform",function(d){
				return "translate("+((meseslargo*d.mes)-14)+",-30)";
			});
			
		}

		
		function initBotonesDeLosLados(DOMid,data,father){

			var papa = father;
			var svg = d3.select(DOMid);
			var botones = svg.selectAll(".botonesavance").data(data);

			var mouseIsDown= false;
			var timeInterval = true;

			botones.enter().append("svg:image")
				.attr("xlink:href", function(d){return d.imgpath+"idle.png"})
				.on("mouseover",function(d){ d3.select(this).attr("xlink:href", d.imgpath+"hover.png")})
				.on("mouseout",function(d){ d3.select(this).attr("xlink:href", d.imgpath+"idle.png")})
				.on("click",function(d){
					
					if(d.nombre == "botonAvanza"){
						adelantaMes(lineaTiempo);
					}
					else{
						retrasaMes(lineaTiempo);
					}
					
					visLineaTiempo.setPosicionposicionMarcador();
					visLineaTiempo.setCurrentAnioBlack();
				})
				.attr("width",function(d){return d.w})
				.attr("height",function(d){return d.h})
				.attr("class","botonesavance")
				.attr("transform",function(d){
					return "translate("+d.px+","+d.py+")";
				});
		}
	}
	
	this.initAnios = function(DOMid, data,espacioEntreAnios) {
		var dom = d3.select(DOMid);
		var lineaTiempo = this.lineaTiempo;

		
		var grupoAnios = dom.append("div").attr("class","losAnios");
		var anios = grupoAnios.selectAll(".anioslabels").data(data);
		
		
			anios.enter().append("div")
				.attr("id",function(d,i){ return "anio"+i;})
				.on("click",function(d,i){
					setCurrentAnio(lineaTiempo,i);
				})
				.text(function(d,i){ return d});	
		
		
	}

	this.setCurrentAnioBlack = function(){
		var lineaTiempo = this.lineaTiempo;
		for(var i=0;i<lineaTiempo.anios.length;i++)
		{
			if (i == lineaTiempo.posicionMarcador.anio)
			{
				d3.select("#anio"+i).attr("class","selected");
			}else
			{
				d3.select("#anio"+i).attr("class","unselected");
			}
				
		}
	}

	function adelantaMes(linea){
		linea.addmes();
	}
	

	function retrasaMes(linea){
		linea.retrasaMes();
	}

	function setCurrentAnio(linea, anioSeleccionado)
	{
		linea.posicionMarcador.anio = anioSeleccionado;
		visLineaTiempo.setCurrentAnioBlack();
	}

	this.setPosicionposicionMarcador = function(){
		
		var marcador = d3.select(".marcador");
		marcador.transition().duration(this.duracion).attr("transform",function(d){
				
					return "translate("+((visLineaTiempo.meseslargo*visLineaTiempo.lineaTiempo.posicionMarcador.mes)-14)+",-30)";
				});
	}
}




function LineaTiempo(){
	this.meses=["Ene","Feb",
				"Mar","Abr",
				"May","Jun",
				"Jul","Ago",
				"Sep","Oct",
				"Nov","Dic"];

	this.anios;
	this.posicionMarcador;
	this.mesestotales;

	this.setInfo = function(anios,posicionMarcador){
		this.anios = anios;
		this.posicionMarcador = posicionMarcador;
		this.mesestotales = this.getMesesTotales();
	}		

	this.addmes = function(){
		//no hagas nada si estas en la ultima fecha
		if(this.posicionMarcador.anio == this.anios.length-1 && this.posicionMarcador.mes == 11)
			return;

		if(this.posicionMarcador.mes==11)
			this.posicionMarcador.anio = (this.posicionMarcador.anio + 1)%this.anios.length; 
		
		this.posicionMarcador.mes= (this.posicionMarcador.mes + 1)%12;
	}
	this.retrasaMes = function(){
		
		//no hagas nada se llegaste a la primera fecha
		if(this.posicionMarcador.anio == 0 && this.posicionMarcador.mes == 0)
			return;
		
		if(this.posicionMarcador.mes==0)
		{

			this.posicionMarcador.anio = this.posicionMarcador.anio -1; 
			this.posicionMarcador.mes = 11;			
		}
		else
		{
			this.posicionMarcador.mes--;
		}
	}
	this.getMesesTotales=function(){
		return 12;
	}

	this.getCurrentAnio=function(){
		return this.anios[this.posicionMarcador.anio];
	}
}