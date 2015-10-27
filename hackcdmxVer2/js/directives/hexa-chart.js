//utilidades
function classes(root) 
{
  var classes = [];

  function recurse(name, node) 
  {
    if (node.children){ 
        node.children.forEach(function(child) 
        { 
          recurse(node.name, child); 
        }); 
    }
    else { 
      classes.push({
        estado: node.estado,
         className: node.name, 
         value: node.size, 
         color: node.color
       });
    }
  }
  recurse(null, root);
  return {children: classes};
}
//Los ne se consideran hombres
var codeColors = {'hombre' : '#80b1d3', 'mujer':'#fb8072', 'ne' : '#80b1d3', 'novivo': '#d9d9d9', 'muerto' : '#525252'};
function getCategoryColor(cat1, cat2, cat3, index, escala)
{
  //mapea en proporcion al tope, 200 pts
  var rango_cat1 = escala(cat1)
  var rango_cat2 = rango_cat1 + escala(cat2);
  var rango_cat3 = rango_cat1 + escala(cat3);
  //var r3 = r2 + escala(n);
  var color = codeColors['novivo'];//'#ccebc5';
  //capa1 <- 'mujer', capa2 <- 'hombre', capa3 <- 'ne', capa4 <- 'no vivos'
  if (index < rango_cat1)
    color = codeColors['mujer'];
  else if( index < rango_cat2)
    color = codeColors['hombre'];
  else if (index < rango_cat3)
    color = codeColors['ne'];
  return color;
}

function rompeLineas(s, maxLetrasPorLinea)
{
  var words = s.split(" ");
  words.reverse();  
  
  var result = [];
  var linea = ""; 
  var nueva_palabra;    
  while(words.length > 0 )
  {   
    nueva_palabra = (linea.length == 0 ? "" : " ") + words.last();
    if (linea.length == 0 && nueva_palabra.length > maxLetrasPorLinea) break;

    if ( (linea.length + nueva_palabra.length) <= maxLetrasPorLinea)
    { 
      linea += nueva_palabra;
      words.pop();      
    }else
    {
      result.push(linea);
      linea = "";
    } 
  } 
  if (linea.length > 0){ result.push(linea); }
  return result;
}

if (!Array.prototype.last){
    Array.prototype.last = function(){
        return this[this.length - 1];
    };
};

//definición de la directiva
app.directive('hexaChart',function()
{
  function link(scope, el, attr){
//agregar y crear en canvas.
    var color = d3.scale.category10();
        var data = scope.data;
        var width = 220;
        var height = 220;
        var min = Math.min(width, height);
var delay = 500; //1/2 segundo
var diameter=170;
    format = d3.format(",d"),
    color = d3.scale.category20c();

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1.5);

var svg = d3.select(el[0]).append('svg')
    .attr("width", width)
    .attr("height", height)
    .attr("class", "bubble");
     //.on("click", click);

var chart = svg.append("g")
      .attr("class","hospital")
      .attr("transform","translate(0,30)");

var bubble_radius=4;
var legendas;
var padding = { left: 40, top: 40, right: 10, bottom: 40};
var cell_padding = { left: 40, top: 0.5, right: 30, bottom: 70};

var bubble = d3.layout.pack()
    .sort(null)
    .size([diameter, diameter])
    .padding(1);

var nodes = {};

////////////////////////////////////
  function updata_hex_by_date(data, year,month)
  {

      if(!data){ return; }
      //svg.selectAll("g").remove();
      svg.selectAll("text").remove();
      var row = new Object();      
      row.id = data["key"];
      data = data.value[year][month];
            
      //d3.entries(data)   [0]   .value[2011][1]
      //Object { NO VIVOS: 23, (N.E.): 1, defunciones: 36, MASCULINO: 124, nacimientos: 259, FEMENINO: 111 }
      nodes = {};
      //empaqueta los datos por fila    
      
      row.masculino = data["MASCULINO"];
      row.femenino = data["FEMENINO"];  
      row.nacidos = data["nacimientos"]; 

            //solo muestra 180 puntos como maximo en los nacimientos
      var top_ = 180;
      if(row.nacidos > top_){
        row.nac_total = row.nacidos;
        row.nacidos = top_;
      }else if(row.nac_total == 'undefined'){
        row.nac_total = row.nacidos;
      }
      row.novivos = data['NO VIVOS'];
      row.nacimientos = row.nac_total; //*row.nacidos cambio de variable
      row.noespec = row.nacimientos - (row.masculino + row.femenino + row.novivos);
      row.defunciones = data["defunciones"];


      

      var umbralScale = d3.scale.linear()
            .domain([0,row.nacimientos])
            .range([0,row.nacidos]);  //**sin tope de 180
      //genera datos
      //var lista = d3.range(row.nacidos);
      
      var lista = d3.range(row.nacidos);
      
      //colorea puntos
      var nacidos = lista.map(function(i) 
      {         
        var color_sexo = getCategoryColor(row.femenino, row.masculino, row.noespec, i, umbralScale);
        return {size: 1, estado:"vivo", color: color_sexo}; 
      });

      var muertos = d3.range(row.defunciones).map(function() { 
                        return {size: 1, estado:"muerto", color:"red"}; 
                      });

      var vivosymuertos = nacidos.concat(muertos);
      
      nodes[row.id] = {children:vivosymuertos};
       //debugger;       
       //tricky: con el slice omitimos el nodo padre, que aparece en el centro :) !!
       var data_bubble = bubble.nodes(classes(nodes[row.id])).slice(1);       
       
       if(nodes[row.id]["children"].length==0){ return;}
       

        //Agregar nombre del hospital
        //1. agrupar por id y obtener datos del hospital 
        var mapHospitales = d3.nest().key(function(d){ return d.id }).sortKeys(d3.ascending).rollup(function(d){return d; }).map(hospitales);
        var entry = mapHospitales[row.id][0];
        var title = rompeLineas(entry.Nombre, 25);  
        //var title = rompeLineas("("+posx +","+ posy + ") (" + auxx + ", "+ auxy + ")", 25);  

        svg
          .selectAll("title_text")
          .data(title)
          .enter()
          .append("text")
            .attr("class","nombre_del_hospital")
            .attr("dx", diameter*0.5)
            .attr("dy", function(d,i) { return (i+1)*12 ; })            
            .style("text-anchor", "middle")
            .style("font-weight", "bold")
            .text(function(d) { return d; });

       // update all the arcs (not just the ones that might have been added)       
       bubbleHospital = 
          chart.selectAll("circle." + row.id)
         .data(data_bubble);


       bubbleHospital
        .enter()
        .append("circle")
          .attr("class",row.id)
          .attr("id", function(d){return d.estado;})
          .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
          //.style("fill","white")
          .style("opacity", 0.0)
          .attr("r",bubble_radius);

        bubbleHospital
        .attr("r", bubble_radius)
        .transition()
            .duration(delay)            
            .style("fill",function(d,i){ return d.estado=="vivo" ?  d.color : codeColors['muerto']})        
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
        

        //agregar info
           resumen = [   
            { "id": "N", "total": row.nacimientos },
            { "id": "H", "total": (row.masculino + row.noespec) },
            { "id": "M", "total": row.femenino},
            { "id": "NV" , "total": row.novivos},
            { "id": "D", "total": row.defunciones},
            ];
          

          svg
            .selectAll("detail_text")
            .data(resumen,function(d){return d.total; })
            .enter()
            .append("text")
              .attr("class","legend")
              .attr("dx", function(d,i){return diameter;})
              .attr("dy", function(d,i) { return diameter *0.2 + (i+1)*14 ; })      
              .style("text-anchor", "left")      
              .text(function(d) { return d.id + ": " + d.total; });

              
        
        
            
   }

   scope.$watch('month * year', function(){
      var year = scope.year, month = scope.month
/*      
      years.selectAll('.year').each(function(){
        d3.select(this).call(update_path_length_for_year, month, year)
      })*/

        //console.log(scope.data);
        //actualiza los datos
        updata_hex_by_date(scope.data,year,month);

    })

    scope.$watch('data', function(data)
    {
      /*debugger;
      console.log(data);*/          
      updata_hex_by_date(data,2011,1);      
    }, true);
      
  }


  return {
    link: link,
    restrict: 'E',
    scope: { data: '=', year: '=', month: '='  }
  };


});