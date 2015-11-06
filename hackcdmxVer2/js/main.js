//
var generalWidth=1000;
var generalHeight=1000;
//esta es la clase controladora de la visualizacion en general
//controla las transiciones entre los estados de la visualizacion
//controla que elementos son visibles
//crea los canvas de d3
var controlVisualizacion = new controlVisualizacion();

inicia();
//inicia el control visual con la escena
function inicia(){
  controlVisualizacion.iniciaControlVisualizacion();
  controlVisualizacion.creaHTMLGeneral();  
  controlVisualizacion.iniciaElementosDOM();

  var lineTimeChart = new LineTimeChart();
  //lineTimeChart.initLineChart(,"linechart",400,100);
  //lineTimeChart.createBordersWithDomain(0,1000);
  //lineTimeChart.insertLines(hospitales_arreglo_2011);
  //iniciamos con la escena 1
  controlVisualizacion.comenzamos();
}


//-----------------------------------------------
//Este es el control principal de la visualización
//contiene los elementos visuales
//y direcciona las acciones ante las acciones del usuario 
function controlVisualizacion(){
  //canvas principal
  this.svg;
  //controlador de los elementos visuales de los hospitales
  this.controladorHospitales;
  this.controladorGrupoHospitales;
  //controladores de eventos
  this.controlDelTiempo;
  this.controladorDeEscenas; 
  this.centroDeControl;


  this.iniciaControlVisualizacion = function(){
    this.controladorHospitales = new ControladorHospitales();
    this.controladorGrupoHospitales = new controladorGrupoHospitales();

    this.controlDelTiempo = new ControlDelTiempo();
    this.controlDelTiempo.iniciaControlDelTiempo();
    
    this.centroDeControl = new CentroDeControl();
    this.centroDeControl.initCentroDeControl();

    this.controladorDeEscenas = new ControladorDeEscenas();
    this.controladorDeEscenas.iniciaControl(this.controladorHospitales,this.controladorGrupoHospitales);
  }  

  //inicia los dom elementos secundarios
  this.iniciaElementosDOM = function(){
    
    this.controladorHospitales.initDOMsHospitales(this.svg);
    this.controladorGrupoHospitales.initDOM(this.svg);
  } 

  //crea los dos elementos principales de dibujo
  //el canvas general y la linea del tiempo
  this.creaHTMLGeneral = function()
  {
    $('body').append('<div id="visualizacion"></div>');
    $('body').append('<div id="botones"></div>');
    $('body').append('<div id="lineaDelTiempo"></div>');

    this.iniciaCanvasDeVisual("visualizacion",generalWidth,generalHeight);
    this.controlDelTiempo.iniciaVisualLineaDelTiempo("lineaDelTiempo","lineaDelTiempo",900,100,450);
    this.centroDeControl.iniciaDOMSdeCentroDeControl("botones","grupoCentroControl",900,100,450);
  }

  this.iniciaCanvasDeVisual = function(id,w,h)
  {
    this.svg = d3.select("#"+id)
        .append("svg")
        .attr("class","vis_"+id)
        .attr("width",w)
        .attr("height",h)
        .append("g")
        .attr("class","group_"+id);
  }

  //1ª, 2ª, 3ª llamada. comenzamos!
  this.comenzamos = function()
  {
    this.controladorDeEscenas.setEscena1();

    this.centroDeControl.enterBotonesOrdenarPorTipos();

    this.controladorHospitales.updateHexCharts(this.svg,2011,0);
    this.controladorHospitales.updateLineasContadoras(this.svg,2011,0);
    this.controladorHospitales.controladorDeNombreDeHospitales.createNombresDeHospitales(this.svg);
    //manejador automatico del tiempo
    //this.controlDelTiempo.automaticIntervalTimer();
  }

  //cambios de escena generan cambios en las posiciones
  //y objetos visibles.
  this.escuchoCambioDeEscena = function(sceneNum,args){
    console.log("procesando un cambio de escena.Escena:"+sceneNum+",argumentos:"+args);

    switch(sceneNum){
      case 1: this.controladorDeEscenas.setEscena1();
              this.centroDeControl.enterBotonesOrdenarPorTipos();
              break;
      case 2: this.controladorDeEscenas.setEscena2(args[0]);
              this.centroDeControl.enterBotonPorMes();
              break;
    }

  }

  //en esta parte controla los cambios ocurridos cuando cambia la fecha.
  this.escuchoCambioDeFecha = function(anio, mes)
  {
   this.controladorHospitales.updateHexCharts(this.svg,anio,mes);
   this.controladorHospitales.updateLineasContadoras(this.svg,anio,mes); 
   
  }

}

//esta funcion controla el estado del tiempo de la visualizacion
//tambien controla el visual de la línea del tiempo
//la variable posicionMarcador es el tiempo actual.
function ControlDelTiempo()
{
  this.anios;
  this.posicionMarcador;
  this.visLineaTiempo;
  this.largoLinea;
  this.dateTimeInterval;
  var that = this;

  this.iniciaControlDelTiempo = function()
  {
    this.anios = [2011,2012];
    this.posicionMarcador = {mes:0,anio:0};
    this.visLineaTiempo = new visLineaTiempo();
    this.largoLinea = 450;

    this.visLineaTiempo.initLineaTiempo(this.anios,this.posicionMarcador);
  }
  
  this.iniciaVisualLineaDelTiempo = function(DOMid,id,w,h,d)
  {
    this.visLineaTiempo.initvisualizacion("#"+DOMid,id,w,h,d);
    this.visLineaTiempo.dovisualizacion(d);
  }

  this.automaticIntervalTimer = function(){
   this.dateTimeInterval = setInterval(addMonth,800);
  }

  this.stopAutomaticIntervalTimer = function(){
    clearInterval(this.dateTimeInterval);
  }

  function addMonth(){
    that.visLineaTiempo.adelantaMes();
  }
}



//esta funcion controla los cambios a ejecutar cuando se cambia
//de escena
function ControladorDeEscenas(){
  //contiene el controlador de elementos visuales
  var controladorHospitales;

  this.iniciaControl = function(_controladorHospitales,_controaldorGrupoHospitales){
    controladorHospitales = _controladorHospitales;
    controladorGrupoHospitales = _controaldorGrupoHospitales;
  }


  this.setEscena1 = function(){
   
    controladorGrupoHospitales.resetPosicionDeDOMSGrupos();
    
    //define el diametro de los hexagonos
    //y el radio de los circulos
    controladorHospitales.controladorDeHexCharts.setDiameter(80);
    controladorHospitales.controladorDeHexCharts.setRadius(2);
    //pon las lineas Contadoras de un lado 
    controladorHospitales.controladorDeLineasContadoras.movePosicionLineasContadoras(75,90);
    controladorHospitales.controladorDeLineasContadoras.setLargoLinea(50);

    
    //inserta los hospitales al wrapper-all-hospitals
    setTimeout(function(){
      //your code to be executed after 1 seconds
      controladorHospitales.insertHospitalesToWrapper();
    }, 1000); 
    

    //pon los hospitales en grid
    controladorHospitales.setPosicionDeDOMSHospitales(definidorDePosiciones.generaGrid(0,0,generalWidth, generalHeight,80,150, hospitalesids));
    

    controladorHospitales.addChangeOpacityListeners();
  }

  //en la escena dos se ordenan los hospitales por delegacion o por tipo de hospital
  this.setEscena2 = function(categoria){
    
    var hospitalesPorTipo = categoria=="Tipo" ? mapHospitalesPorTipo : mapHospitalesPorDelegacion; 
    //controladorHospitales.setPosicionDeDOMSHospitales(definidorDePosiciones.generaClustersDePosicionesPorTipo(0,0,800,400,80,150,arregloPorTipo,50));
    var arreglo_hospitalesPorTipo = createObjectToArray(hospitalesPorTipo);
    controladorGrupoHospitales.createGrupoDoms(categoria,arreglo_hospitalesPorTipo);
    controladorGrupoHospitales.insertHospitalesToGroupWrapper(arreglo_hospitalesPorTipo);
    var keys = Object.keys(hospitalesPorTipo);

    controladorGrupoHospitales.setPosicionDeDOMSGrupos(
        createObjectToArray(hospitalesPorTipo),
        definidorDePosiciones.generaRenglones(0,0,200,keys));

    //por cada grupo hacer un acomodo grid
    
    for(key in hospitalesPorTipo){
      var hospitalesids = (hospitalesPorTipo[key]).map(function(h){return h.id});
      controladorHospitales.setPosicionDeDOMSHospitales(definidorDePosiciones.generaGrid(0,0,generalWidth, generalHeight,80,150, hospitalesids));  
    }
    
  }

  //en la escena tres se muestran los datos acumulando por mes.
  this.setEscena3 = function(){
    var circulos = d3.selectAll("#vivo");

    circulos.transition().duration(1000).attr("transform", function(d) { 
         return "translate(" + 0 + "," + 0 + ")"; });


  }

}


//Este objeto controla la declaracion 
//de los doms para los hospitales
// controla los cambios de posiciones.
// controla que elementos son visible en que momento
// controla los updates de los elementos
function ControladorHospitales(){
  var DOMsHospitales = {};
  var DOMsNombresHospitales = {};
  var DOMsHexCharts = {};
  var DOMsLineasContadoras = {};
  var DOMsLeyendas = {};
  var grupoHospitales;
  this.controladorDeHexCharts = new ControladorDeHexCharts();
  this.controladorDeLineasContadoras = new ControladorDeLineasContadoras();
  this.controladorDeNombreDeHospitales = new ControladorNombresDeHospitales();

  this.initDOMsHospitales = function(svg){
  
    grupoHospitales = svg.append("g").attr("class","wrapper-all-hospitals");
    var hospitalDomElement;
    var nombreHospitalDomElement;
    var hexChartDOMElement;
    var lineaContadoraDOMElement;
    var leyendasDOMElement;
    hospitales.forEach(function(hospital){
        
         hospitalDomElement = grupoHospitales.append("g")
          .attr("class","wrapper-hospital")
          .attr("id",hospital.id);


          //cada hospital contiene un título
          nombreHospitalDomElement = hospitalDomElement.append("g").attr("class","nombre");
          //cada hospital contiene un hexchart
          hexChartDOMElement = hospitalDomElement.append("g").attr("class","hexChart");
          //cada hospital contiene una linea contadora
          lineaContadoraDOMElement = hospitalDomElement.append("g").attr("class","lineaContadora");
          //cada hospital tiene leyendas
          leyendasDOMElement = hospitalDomElement.append("g").attr("class","leyendas");

        DOMsHospitales[hospital.id]=hospitalDomElement;
        DOMsNombresHospitales[hospital.id]=nombreHospitalDomElement;
        DOMsHexCharts[hospital.id]=hexChartDOMElement;
        DOMsLineasContadoras[hospital.id]=lineaContadoraDOMElement; 
        DOMsLeyendas[hospital.id] = leyendasDOMElement;    
      });
   
      //entrega los doms a los controladores
      this.controladorDeHexCharts.setHexDoms(DOMsHexCharts);
      this.controladorDeLineasContadoras.setLineasContadorasDOMs(DOMsLineasContadoras);
      this.controladorDeNombreDeHospitales.setNombresDOMs(DOMsNombresHospitales);

      //inicializa los elementos dom internamente en los controladores
   
      this.controladorDeHexCharts.initHexCharts();

  }

  this.insertHospitalesToWrapper = function(){
    for(var key in DOMsHospitales){
      $(".wrapper-hospital#"+ key).appendTo(grupoHospitales);
    }
  }

  this.updateHexCharts = function(svg,anio,mes)
  {
    this.controladorDeHexCharts.updateHexsHospitales(svg,anio,mes);
  }

  this.updateLineasContadoras = function(svg,anio,mes)
  {
    this.controladorDeLineasContadoras.updateLineasContadoras(svg,anio,mes);
  }

  this.setPosicionDeDOMSHospitales = function(posiciones){
    for(var id in posiciones){
        domHospital = DOMsHospitales[id];
        domHospital.transition().duration(800).attr("transform", function(d) { 
         return "translate(" + posiciones[id].x + "," + posiciones[id].y + ")"; });
    }
  }

  this.addChangeOpacityListeners = function(){
    for(var id in DOMsHospitales){
      
      DOMsHospitales[id]
      .on("mouseenter",function(d){
        var hospitaldata = mapHospitales[this.id][0];
        $("#"+hospitaldata.subtipo.replace(/[^\w\*]/g,'')+".lineChart > g."+hospitaldata.id+" > path").attr("mouse","in");
      })
      .on("mouseover",function(d){
        var hospitaldata = mapHospitales[this.id][0];
        $("#"+hospitaldata.subtipo.replace(/[^\w\*]/g,'')+".lineChart > g."+hospitaldata.id+" > path").attr("mouse","in");
      })
      .on("mouseout",function(d){
        var hospitaldata = mapHospitales[this.id][0];
        $("#"+hospitaldata.subtipo.replace(/[^\w\*]/g,'')+".lineChart > g."+hospitaldata.id+" > path").attr("mouse","out");        
      });
    }
  }
}

//Cada hospital contiene un hex chart
//esta clase controla la declaración de estos y el updateo
//es controlada por la clase ControladorHospitales. 
function ControladorDeHexCharts(){

  var bubbleHospitals = {};
  var diameter=170;
  var delay = 500;

  //variable pack de d3
  var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(0.1);

  var bubble_radius=4;

  var row={};
  var nodes={};

  var svg,DOMsHospitales,DOMsHexCharts;
       
  var hexbin;

  var addBackHexagonfunction;
  //here we initialize the elements of the hex charts
  this.initHexCharts = function ()
  {
    hexbin = d3.hexbin();

         
    
  }

  this.addBackHexagon = function(domHospital){
       hexbin = d3.hexbin()
        .radius(diameter);

       var backHexagons = domHospital.selectAll(".backHexagons").data([1]);
        
        backHexagons.enter().append("path")
          .attr("class","backHexagons")
          .attr("d", hexbin.hexagon(diameter/2));

        backHexagons
          .attr("transform","translate("+diameter/2+","+diameter/2+") rotate(90)");
}


  //d3
  this.updateHexsHospitales= function(_svg,anio,mes){
    svg = _svg;
    addBackHexagonfunction = this.addBackHexagon;
  
    hospitales.forEach(function(hospital){
     
       //las estadisticas del hospital en el año y mes especifico
       //al ser un controlador tiene acceso directo  a los datos
      var mydata = hospitales_datos[hospital.id][anio][mes+1];
      nodes ={};

      row.masculino = mydata["MASCULINO"];
      row.femenino = mydata["FEMENINO"];  
      row.nacidos = mydata["nacimientos"]; 

      //solo muestra 180 puntos como maximo en los nacimientos
      var top_ = 180;
      if(row.nacidos > top_){
        row.nac_total = row.nacidos;
        row.nacidos = top_;
      }else if(row.nac_total == 'undefined'){
        row.nac_total = row.nacidos;
      }
      row.novivos = mydata['NO VIVOS'];
      row.nacimientos = row.nac_total; //*row.nacidos cambio de variable
      row.noespec = row.nacimientos - (row.masculino + row.femenino + row.novivos);
      row.defunciones = mydata["defunciones"];

      var umbralScale = d3.scale.linear()
            .domain([0,row.nacimientos])
            .range([0,row.nacidos]);  //**sin tope de 180

      
      
      //colorea puntos
      var nacidos = d3.range(row.nacidos).map(function(i) 
      {         
        var clase = getCategory(row.femenino, row.masculino, row.noespec, i, umbralScale);
        return {size: 1, estado:"vivo", class: clase}; 
      });

      var muertos = d3.range(row.defunciones).map(function() { 
                        return {size: 1, estado:"muerto", class:"muerto"}; 
                      });
      //Esta variable contiene todos los dots que se agregaran en el hexagono
      //con su categoria definida
      var vivosymuertos = nacidos.concat(muertos);

      //en esta variable guardamos los vivosymuertos para que su posicion sea
      //procesada por el pack layout.
      nodes = {children:vivosymuertos};

      //aqui generamos la data del bubble.
      //tricky: con el slice omitimos el nodo padre, que aparece en el centro :) !!
       var data_bubble = bubble.nodes(classes(nodes)).slice(1);  

       //hay cosos en la data que no hay ningun nodo.
       //son casos que la recopilación de datos debe estar mal
       if(nodes["children"].length==0){ return;}

      //tomo el dom element del grupo para el hex del hospital
       var domHospital = DOMsHexCharts[hospital.id];
     
        domHospital.attr("transform","translate(0,20)");
       addBackHexagonfunction(domHospital);
      // domHospital.attr("transform","translate(" + 0 + "," + 20+ ")");
       //selecciono sólo los circulos del hospital correspondiente
       //porque el domHospital es el DOM especifico de ese hospital
       var bubbleHospital = 
          domHospital.selectAll("circle")
         .data(data_bubble);

      //d3
      bubbleHospital
        .enter()
        .append("circle")
          .attr("class",function(d){return d.class;})
          .attr("id", function(d){return d.estado;})
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          //.style("fill","white")
          .style("opacity", 0.0)
          .attr("r",bubble_radius);

      bubbleHospital
        .attr("r", bubble_radius)
        .transition()
            .duration(delay)            
            //.style("fill",function(d,i){ return d.estado=="vivo" ?  d.color : codeColors['muerto']})        
            .style("opacity",1.0)            
            //.style("stroke-width", 0.5)
            .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })

       bubbleHospital
          .exit()
          .transition()
          .duration(delay)
          .style("opacity",0.0)
          //.attr("r",0)
          .remove();     
    });
    


  }

  this.setHexDoms = function(_DOMsHexCharts){
    DOMsHexCharts = _DOMsHexCharts;
  };

  this.setDiameter = function(d){
    diameter = d;

    bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(0.1);
  };

  this.setRadius = function(r){
    bubble_radius = r;
  };

}

 function ControladorDeLineasContadoras(){
  var lineasContadoras = {};
  var svg,DOMsLineasContadoras;

  //defunciones, no vivos,masculino,nacimientos,femenino
  var circleSizes={};
  var largoLinea=100;
  var lineScale;
  var delay = 500;

  var that = this;

  //posicion
  var px,py;

  var classes = [ "no-vivos","hombres","nacimientos","mujeres"];
  this.updateLineasContadoras = function(_svg,anio,mes){

    var domHospital;
    svg = _svg;

    //por cada hospital
    hospitales.forEach(function(hospital){
      
      //consigo la data especifca del hospital mes y año
      var mydata = hospitales_datos[hospital.id][anio][mes+1];
      
      var marcadores;
      lineScale = d3.scale.linear()
            .domain([0,400])
            .range([0,largoLinea]);


      // consigue el DOM para la linea del hospital
      var domLinea = DOMsLineasContadoras[hospital.id];

      var lineaCentral = domLinea.selectAll(".lineaCentral").data([largoLinea]);

      lineaCentral.enter().append("line").attr("class","lineaCentral");

      lineaCentral
        .transition()
        .duration(500)
        .attr("x1",0)
        .attr("y1",0)
        .attr("x2",0)
        .attr("y2",function(d){return d});

      //sacamos el valor de defunciones porque no va a ser un circulo.
      if(mydata.hasOwnProperty("defunciones")){
        var totalDefunciones = mydata["defunciones"];
        delete mydata["defunciones"];  

        //aqui agregamos el elemento para las defunciones     
        marcadores = domLinea.selectAll(".defunciones").data([totalDefunciones]);

        marcadores.enter().append("path")
          .attr("class","defunciones")
          .attr("d", d3.svg.symbol().type("triangle-down"))
          .attr("transform", function(d) {  return "translate(" + 0 + "," + 0 + ")"; });

        marcadores.transition()
              .duration(500)
              .attr("transform", function(d){               
                return "translate(" + 0 + "," + (largoLinea - lineScale(d)) + ")"
               });
      }
      
      //get the array of the data
      var dataArray = createObjectToArray(mydata);

     
      marcadores = domLinea.selectAll("circle").data(dataArray,function(d){return d.key;});

      marcadores.enter()
        .append("circle")
        .attr("class",function(d,i){return d.key.replace(/[^\w\*]/g,'');})
        .attr("transform", function(d) {  return "translate(" + 0 + "," + 0 + ")"; })

      marcadores
        .attr("r", 4)
        .transition()
            .duration(500)
            .attr("transform", function(d){ 
              return "translate(" + 0 + "," + (largoLinea - lineScale(d.value)) + ")"
             })        
            //.style("fill",function(d,i){ return d.estado=="vivo" ?  d.color : codeColors['muerto']})        
            .style("opacity",1.0);  

         
      });

    
    }

    this.movePosicionLineasContadoras = function(x,y){
      var domlinea;
      
      hospitalesids.forEach(function(id){
        domlinea = DOMsLineasContadoras[id];
        domlinea.attr("transform", function(d) {  return "translate(" + x + "," + y + ")"; })
      });
      
    };

    this.setLineasContadorasDOMs = function(_DOMsLineasContadoras)
    {
      DOMsLineasContadoras = _DOMsLineasContadoras;
    };

    this.setLargoLinea = function(largo){
      largoLinea = largo;
    }

  }

function ControladorNombresDeHospitales(){
  var DOMsNombresHospitales;
  var svg;

  this.createNombresDeHospitales=function(_svg){
   svg = _svg;
    //por cada hospital

     hospitales.forEach(function(hospital){
        //consigue el DOM asignado para el nombre del hospital por su id
        var domNombre = DOMsNombresHospitales[hospital.id];
        //colocalo
        


        var title = rompeLineas(hospital.Nombre,25);

        var nombre = domNombre.selectAll("text").data(title);
          
          

          nombre.enter().append("text")
            .attr("class","nombre_del_hospital")
            .attr("dx",50)
            .attr("dy", function(d,i) { return (i+1)*8 ; })            
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text(function(d) { return d; });
        
     });
  }
  this.setNombresDOMs = function(_doms){
    DOMsNombresHospitales = _doms; 
  }

}

//Esta funcion es el centro de control para el usuario
//contiene todos los botones para manejar la visualizacion
//maneja como los controles entran y salen
//y levanta los eventos
function CentroDeControl(){
  this.groupDOM;
  this.botones;
  this.width;
  this.height;
  this.DOMid;
  this.duracion;

  
  this.initCentroDeControl = function(){
  }

  //aqui se inicia el svg que contendra los controles
  this.iniciaDOMSdeCentroDeControl = function(DOMid,classname,w,h,duration){
    
    this.width = w;
    this.height = h;
    this.DOMid = DOMid;
    this.classname = classname;
    this.duracion = duration;

    var svg = d3.select("#"+DOMid)
        .append("svg")
        .attr("class","vis"+classname)
        .attr("width",w)
        .attr("height",h)
        .append("g")
        .attr("class",classname);

    this.initDOMsParaBotones(svg);
  }


  this.initDOMsParaBotones = function(svg){
    this.groupDOM = svg.append("g").attr("class","botones");
  }

  this.fireEvent = function(args){
      var sceneNum = args[0];
      var sceneArguments = args[1];
     
      controlVisualizacion.escuchoCambioDeEscena(sceneNum,sceneArguments);
  }


  
  //crea los Botones por tipo
  this.enterBotonesOrdenarPorTipos = function(){
    //se eliminan botones previos que esten cargados en la vista
    if(this.botones){
      this.botones.eliminaBotones();
    }
    

    //set the data 
    var botonesData = [{nombre:"botonOrdenarPorTipo",initial_px:200 ,initial_py:200 ,update_px:200 ,update_py:50 ,w:100, h:30, imgpath:"imgs/botones/OrdenarPorTipo_",args:[2,["Tipo"]]},
                {nombre:"botonOrdenarPorDelegacion" ,initial_px:300 ,initial_py:200 ,update_px:300 ,update_py:50 ,w:100, h:30, imgpath:"imgs/botones/OrdenarPorDelegacion_",args:[2,["Delegacion"]]}];
     
    this.botones = new GrupoDeBotones();
    this.botones.setEventManager(this);
    this.botones.enterBotones(this.groupDOM,"ordenarPor",botonesData,this.fireEvent);
    
  }

  //Crea boton por mes
  this.enterBotonPorMes = function(){
    //se eliminan botones previos que esten cargados en la vista
    this.botones.eliminaBotones();

    var botonesData = [{nombre:"Regresar",initial_px:200 ,initial_py:200 ,update_px:200 ,update_py:50 ,w:100, h:30, imgpath:"imgs/botones/Regresar_",args:[1,[]]},
    {nombre:"verPorMes",initial_px:300 ,initial_py:300 ,update_px:400 ,update_py:50 ,w:100, h:30, imgpath:"imgs/botones/Regresar_",args:[1,[]]}];
  
    this.botones = new GrupoDeBotones();
    this.botones.setEventManager(this);
    this.botones.enterBotones(this.groupDOM,"verPorMes",botonesData,this.fireEvent);
  }


  

}

function GrupoDeBotones(){
  this.data;
  this.DOMid;
  this.classname;
  this.svgDOM;
  this.botones;

  var eventManager;
  var that = this;
  this.setEventManager=function(_eventManager){
    eventManager = _eventManager;
  }

  this.enterBotones = function(svgDOM,classname,data,_function){
    
    this.classname = classname;
    this.svgDOM = svgDOM;
    
    this.botones = this.svgDOM.selectAll(classname).data(data);
    

    this.botones.enter().append("svg:image")
        .attr("xlink:href", function(d){return d.imgpath+"idle.png"})
        .on("mouseover",function(d){ d3.select(this).attr("xlink:href", d.imgpath+"hover.png")})
        .on("mouseout",function(d){ d3.select(this).attr("xlink:href", d.imgpath+"idle.png")})
        .on("click",function(d){
          work(d.args);
        }

        )
        .attr("width",function(d){return d.w})
        .attr("height",function(d){return d.h})
        .attr("class",this.classname)
        .attr("transform",function(d){
          return "translate("+d.initial_px+","+d.initial_py+")";
        });

    this.botones.transition().duration(1000).attr("transform",function(d){
          return "translate("+d.update_px+","+d.update_py+")";
        });
  }

  this.eliminaBotones = function(){
    var data = [];

    var botones = this.svgDOM.selectAll("."+this.classname).data(data);

    botones.data(data);
    

    botones.exit().transition().duration(1000).attr("transform",function(d){
          return "translate("+d.update_px+","+(d.update_py-50)+")";
        }).style("opacity", 1e-6).remove();
  }

  function work(args){
    eventManager.fireEvent(args);
  }
}


function ControladorLineCharts(){
  this.svg;
  this.doms;

  this.init = function(){   

  }

  this.initVis = function(data){

  }

}

function controladorGrupoHospitales(){

  var DOMsGrupos={};
  var DOMslineCharts={};
  this.byCategory = {};
  var grupoHospitales;
  this.groupData;


  this.initDOM = function(svg,portipo,groupData){    
    this.wrapperDOM = svg.append("g").attr("class","wrapper-all-groups").attr("por",portipo);
    grupoHospitales = new GrupoDeHospitales();
    grupoHospitales.init();
  }

  this.createGrupoDoms = function (portipo,groupData){
    var that = this;
    this.groupData = groupData;
    var wrapperDOM = this.wrapperDOM;
    var grupoDOM;
    var lineChartDOM;
    //solo si no se ha trabajado con esta
    //categoria crea los doms
    if(typeof this.byCategory[portipo]==='undefined'){
      this.byCategory[portipo] = true;


      groupData.forEach(function(grupo){
        
       grupoDOM = wrapperDOM.append("g")
          .attr("class","wrapper-group")
          .attr("id",grupo.key.replace(/[^\w\*]/g,''));

      
       //inserta a los doms de los hospitales a este grupo
       // grupo.value.forEach(function(h){
       //   $(".wrapper-hospital#"+h.id).appendTo(grupoDOM);
       // })
      
        //los grupos contienen un dom para las line charts
        lineChartDOM = grupoDOM.append("g")
          .attr("class","lineChart")
          .attr("id",grupo.key.replace(/[^\w\*]/g,''));

        DOMsGrupos[grupo.key] = grupoDOM;
        DOMslineCharts[grupo.key] = lineChartDOM;
      });
      this.populate();
    }

  }

  this.insertHospitalesToGroupWrapper = function(groupData){
   
    var grupoDOM;
    groupData.forEach(function(grupo){
      grupoDOM = DOMsGrupos[grupo.key];
      grupo.value.forEach(function(h){
         $(".wrapper-hospital#"+h.id).appendTo(grupoDOM);
       });
    });
  }

  this.setPosicionDeDOMSGrupos = function(groupData,posiciones){
 
    var domgrupo,id;
    groupData.forEach(function(grupo){
        id = grupo.key;
        domgrupo  = DOMsGrupos[id];
        domgrupo.transition().duration(800).attr("transform", function(d) { 
         return "translate(" + posiciones[id].x + "," + posiciones[id].y + ")"; })
      });
      
  }

this.resetPosicionDeDOMSGrupos = function(){
    
    var domsgrupos = d3.selectAll(".wrapper-group");

    domsgrupos.transition().duration(800).attr("transform", function(d) { 
         return "translate(0,0)"; });  
  }
  this.populate = function(){
    this.groupData.forEach(function(grupo){
        id = grupo.key;
        domgrupo  = DOMsGrupos[id];
       
        grupoHospitales.createTitle(domgrupo,grupo.key)
        
        var dataHosps = createObjectToArray(
          getHospitalsDataOfIds(
            grupo.value.map(
              function(m){
                return m.id;
              }),"2011"));
        
        domLineChart = DOMslineCharts[id];
        grupoHospitales.createLineChart(domLineChart,dataHosps);
        grupoHospitales.updateLineChart(domLineChart,dataHosps);
      });
  }

}

function GrupoDeHospitales(){
  this.dom;
  this.data;
  this.lineTimeChart;
  this.title;
  this.hexCharts;

  this.init = function(){

    this.lineTimeChart = new LineTimeChart();
    
  }

  this.createTitle = function(dom,title){
    this.title = title;
    dom.append("text").text(title);
  }

  this.setPosicionesHexCharts = function(){

  }

  this.createLineChart = function(dom,data){
    this.lineTimeChart.initLineChart(dom,"lineChart",400,100);
    this.lineTimeChart.createBorders(data);
  }
  this.updateLineChart = function(dom,data){
    this.lineTimeChart.insertLines(dom,data);
  }
}

function LineTimeChart(){
  this.dom;
  this.data;
  this.classname;

  this.x;
  this.y;
  this.year = 2000;

  this.xAxis;
  this.yAxis;
  this.line;

  this.width;
  this.height;

  var that = this;

  this.initLineChart = function(DOMParent,classname,width,height){
    this.width = width;
    this.height = height;

    this.x = d3.time.scale()
    .range([0, width]);

    this.y = d3.scale.linear()
    .range([height, 0]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left");

    this.dom = DOMParent;
    
  }

  this.setYear = function(year){
    this.year = year;
  }

  this.createBordersWithDomain = function(ymin,ymax){
    // define the x scale (horizontal)
    var mindate = new Date(this.year,0),
        maxdate = new Date(this.year,11);

    this.x.domain([mindate, maxdate]);
    this.y.domain([ymin,ymax]);

    this.dom.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);

    this.dom.append("g")
      .attr("class", "y axis")
      .call(this.yAxis);
  }

  this.createBorders = function(data){
  
    var ymin =d3.min(data,function(h){

        return d3.min(h.value,function(m){
          
          return Math.min(m.value.nacimientos,m.value.defunciones);
        })
      });

    var ymax = d3.max(data,function(h){
        return d3.max(h.value,function(m){
          return Math.max(m.value.nacimientos,m.value.defunciones);
        })
      });

    this.createBordersWithDomain(ymin,ymax);
  }

  this.insertLines = function(dom,data){
    var x = this.x;
    var y = this.y;
    
    var hospital = dom.selectAll(".lineaNacimientos")
      .data(data)
      .enter().append("g")
      .attr("class", function(h){
        return h.key;
      });

    

    line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(new Date(2000,d.key-1)); })
    .y(function(d) { 
      return y(d.value.nacimientos);});


    hospital.append("path")
      .attr("class", "line")
      .attr("d",function(d){
  
        return line(d.value);
      })

  }

}


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - LINEA DEL TIEMPO  - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

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

  this.that = this;
  var that = this;

  //esta variable se encarga de controlar los intervalos
  //de llamadas cuando se oprime el boton play
  this.dateTimeInterval;
  this.playing = false;
  this.initLineaTiempo = function(anios,posicionMarcador){
    
    this.lineaTiempo.setInfo(anios,posicionMarcador);
  }

  this.initvisualizacion = function(DOMid,classname,w,h,duration){
    this.width = w;
    this.height = h;
    this.DOMid = DOMid;
    this.classname = classname;
    this.duracion = duration;

    this.initBotonesDePlayPause(DOMid);
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
    var infoposbotones = [{nombre:"botonRegresa",px:-40        ,py:-15 ,w:30, h:30, imgpath:"imgs/lineaDelTiempo/boton_paraAtras_"},
                {nombre:"botonAvanza" ,px:linealargo+13,py:-15 ,w:30, h:30, imgpath:"imgs/lineaDelTiempo/boton_paraAdelante_"}]
    initBotonesDeLosLados(".vis"+this.classname+" ."+this.classname,infoposbotones,that);

    //set botones de play y pause

    

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
            that.adelantaMes();
          }
          else{
            that.retrasaMes();
          }
        
      })
        .attr("width",function(d){return d.w})
        .attr("height",function(d){return d.h})
        .attr("class","botonesavance")
        .attr("transform",function(d){
          return "translate("+d.px+","+d.py+")";
        });
    }
  }

  this.initBotonesDePlayPause = function(DOMid){
    
    var dom = d3.select(DOMid);
    var lineaTiempo1 = this.lineaTiempo;
    
    var grupoPlayPause = dom.append("div").attr("class","PlayPause");

    grupoPlayPause.append("div")
      .attr("id","play-btn")
      .on("mouseover",function(d){
        d3.select(this).attr("class","onMouseOver");
      })
      .on("mouseout",function(d,i){
        d3.select(this).attr("class","onMouseOut");
      })
      .on("click",function(d,i){
        this.playing = !this.playing;

        if(this.playing){
          this.dateTimeInterval = setInterval(that.pr,800);
        }else{
          clearInterval(this.dateTimeInterval);
        }

        d3.select(this).text(
          this.playing ? "Pause" : "Play");

      })
      .text("Play");

      this.pr = function(){
        that.adelantaMes();
      }
  }


  
  this.initAnios = function(DOMid, data,espacioEntreAnios) {
    
    var dom = d3.select(DOMid);
    var lineaTiempo = this.lineaTiempo;

    
    var grupoAnios = dom.append("div").attr("class","losAnios");
    var anios = grupoAnios.selectAll(".anioslabels").data(data);
    
    
      anios.enter().append("div")
        .attr("id",function(d,i){ return "anio"+i;})
        .on("mouseover",function(d){
          d3.select(this).attr("class","onMouseOver");
        })
        .on("mouseout",function(d,i){
          that.setCurrentAnioBlack();
        })
        .on("click",function(d,i){
          that.setCurrentAnio(lineaTiempo,i);

          //AVISA AL CONTROLADOR QUE HUBO UN CAMBIO
           controlVisualizacion.escuchoCambioDeFecha(lineaTiempo.anios[lineaTiempo.posicionMarcador.anio],lineaTiempo.posicionMarcador.mes);
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

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  //estos metodos son accedidos por el cambio de fecha automático
  this.adelantaMes = function(){
  
    this.lineaTiempo.addmes();
    this.setPosicionposicionMarcador();
    this.setCurrentAnioBlack();

    //AVISA AL CONTROLADOR QUE HUBO UN CAMBIO
    this.fireDateChangeEvent();
  }

  this.retrasaMes = function(){
    this.lineaTiempo.retrasaMes();
    this.setPosicionposicionMarcador();
    this.setCurrentAnioBlack();

    //AVISA AL CONTROLADOR QUE HUBO UN CAMBIO
    this.fireDateChangeEvent();
  }
  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  this.fireDateChangeEvent = function(){
    controlVisualizacion.escuchoCambioDeFecha(this.lineaTiempo.anios[this.lineaTiempo.posicionMarcador.anio],this.lineaTiempo.posicionMarcador.mes);       
  }

  function adelantaMes(linea){
    linea.addmes();
  }
  

  function retrasaMes(linea){
    linea.retrasaMes();
  }

  this.setCurrentAnio = function(linea, anioSeleccionado)
  {
    linea.posicionMarcador.anio = anioSeleccionado;
    
    that.setCurrentAnioBlack();
  }

  this.setPosicionposicionMarcador = function(){
    
    var marcador = d3.select(".marcador");
    var that = this;
    marcador.transition().duration(this.duracion).attr("transform",function(d){
        
          return "translate("+((that.meseslargo*that.lineaTiempo.posicionMarcador.mes)-14)+",-30)";
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


