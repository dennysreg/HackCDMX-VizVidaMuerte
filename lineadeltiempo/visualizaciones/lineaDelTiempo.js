

function visLineaTiempo(){
	this.width;
	this.height;
	this.margin;
	this.DOMid;
	this.classname;
	this.duration;
	this.lineaTiempo = new LineaTiempo();

	this.linealargo;

	this.initLineaTiempo = function(anios,posicionMarcador){
		
		this.lineaTiempo.setInfo(anios,posicionMarcador);
	}

	this.initvisualizacion = function(DOMid,classname,w,h,duration){
		this.width = w;
		this.height = h;
		this.DOMid = DOMid;
		this.classname = classname;
		this.duration = duration;
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
		var medidaMes = linealargo/lineaTiempo.mesestotales;
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




		function initMarcador(DOMid,imgpath,data,meseslargo){
			var svg = d3.select(DOMid);
			
			var posicionMarcador = svg.selectAll(".marcador").data(data);
			posicionMarcador.enter().append("svg:image")
			.attr("xlink:href", imgpath)
			.attr("width",28)
			.attr("height",28)
			.attr("class","marcador")
			.attr("transform",function(d){
				return "translate("+((meseslargo*d.posicionMes)-14)+",-30)";
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
				.on("click",				)
				.attr("width",function(d){return d.w})
				.attr("height",function(d){return d.h})
				.attr("class","botonesavance")
				.attr("transform",function(d){
					return "translate("+d.px+","+d.py+")";
				});

			
		}
	}
	
	

	

	this.retrasaMes = function(){
		this.lineaTiempo.retrasaMes();
	}

	this.setPosicionposicionMarcador = function(){

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
		if(posicionMarcador.mes==11)
			(posicionMarcador.posanio++)%this.anios.length; 
		
		(posicionMarcador++)%11;
	}
	this.retrasaMes = function(){
		if(posicionMarcador.mes==0)
			(posicionMarcador.posanio--)%this.anios.length; 

		(posicionMarcador--)%11
	}
	this.getMesesTotales=function(){
		return 12;
	}
}