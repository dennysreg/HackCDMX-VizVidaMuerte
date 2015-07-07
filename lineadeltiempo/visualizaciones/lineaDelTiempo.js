

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

		var svg =  d3.select(".vis"+this.classname+" ."+this.classname)
					.attr("transform","translate("+this.width*.05+","+this.height*.50+")");

		/*dibuja la linea*/
		var grupoLinea = svg.append("g").attr("class","lalinea")
			.attr("transform","translate("+40+","+20+")");
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
		var infoposbotones = [{nombre:"botonRegresa",px:0 			 ,py:0 ,w:30, h:30, imgpath:"imgs/lineaDelTiempo/boton_paraAtras_"},
							  {nombre:"botonAvanza" ,px:linealargo+40,py:0 ,w:30, h:30, imgpath:"imgs/lineaDelTiempo/boton_paraAdelante_"}]
		initBotonesDeLosLados(".vis"+this.classname+" ."+this.classname,infoposbotones,that);

		this.initAnios(".vis"+this.classname,lineaTiempo.anios,100);

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
		var svg = d3.select(DOMid);
		var lineaTiempo = this.lineaTiempo;

		debugger;
		var grupoAnios = svg.append("g").attr("class","losAnios");
		var anios = grupoAnios.selectAll(".anioslabels").data(data);
		
		for(var i=0;i<=lineaTiempo.anios.length;i++)
		{
			anios.enter().append("text")
				.attr("x",espacioEntreAnios*i)
				.attr("y",10)
				.text(lineaTiempo.anios[i]);	
		}
		
	}


	function adelantaMes(linea){
		linea.addmes();
	}
	

	function retrasaMes(linea){
		linea.retrasaMes();
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
		if(this.posicionMarcador.mes==11)
			(this.posicionMarcador.anio++)%this.anios.length; 
		
		(this.posicionMarcador.mes++)%11;
	}
	this.retrasaMes = function(){
		if(this.posicionMarcador.mes==0)
			(this.posicionMarcador.anio--)%this.anios.length; 

		(this.posicionMarcador.mes--)%11
	}
	this.getMesesTotales=function(){
		return 12;
	}

	this.getCurrentAnio=function(){
		return this.anios[this.posicionMarcador.anio];
	}
}