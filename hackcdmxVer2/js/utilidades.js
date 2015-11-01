
//hospitales = hospitales.slice(0,2);

var mapHospitales = d3.nest().key(function(d){ return d.id }).sortKeys(d3.ascending).rollup(function(d){return d; }).map(hospitales);
var mapHospitalesPorTipo = d3.nest().key(function(d){ return d.subtipo; }).sortKeys(d3.ascending).rollup(function(d){return d; }).map(hospitales);
var mapHospitalesPorDelegacion = d3.nest().key(function(d){ return d.delegacion; }).sortKeys(d3.ascending).rollup(function(d){return d; }).map(hospitales);

var hospitalesids = Object.keys(mapHospitales);


var hospitales_arreglo = createObjectToArray(hospitales_datos);
var hospitales_arreglo_2011 =hospitales_arreglo.map(
  function(obj){
    var rObj = {};
      
      rObj["key"] = obj.key;

      rObj["values"] = createObjectToArray(obj.value["2011"]);
    
      return rObj;
    });

//utilidades

var definidorDePosiciones = new DefinidorDePosiciones();


function getCategory(cat1, cat2, cat3, index, escala)
{
  //mapea en proporcion al tope, 200 pts
  var rango_cat1 = escala(cat1)
  var rango_cat2 = rango_cat1 + escala(cat2);
  var rango_cat3 = rango_cat1 + escala(cat3);
  //var r3 = r2 + escala(n);
  var category = 'novivo';//'#ccebc5';
  //capa1 <- 'mujer', capa2 <- 'hombre', capa3 <- 'ne', capa4 <- 'no vivos'
  if (index < rango_cat1)
    category = 'mujer';
  else if( index < rango_cat2)
    category = 'hombre';
  else if (index < rango_cat3)
    category = 'ne';
  return category;
}

//Se usa por el layout pack
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
         class: node.class
       });
    }
  }
  recurse(null, root);
  return {children: classes};
}

function createObjectToArray(myObject){
  var returnArray=[];

  for(var key in myObject) {
    if(myObject.hasOwnProperty(key)) {
        var obj = {};
        obj.key = key;
        obj.value = myObject[key];
        returnArray.push(obj);
    }
  }
  return returnArray;
}
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - DEFINIDOR DE POSICIONES - - - - - -  - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

//esta función genera arreglos de ayuda para acomodar elementos.
function DefinidorDePosiciones(){
  //variables de utilidad para posicionamiento

  //genera las posiciones para todos para todos los elementos de un arreglo 
  this.generaGrid = function(offSetX,offSetY,gridW,gridH,w,h,ids)
  {
    var gridPositions = {};
    var gridPosition = {};
    var objsInX = gridW/w;
    var objsInY = gridH/h;
    var i =0,j=0;
    var counter = 0;

    while(counter < ids.length)
    {
      if(i>objsInX-1)
      { 
        i=0;j++;
      }
      	gridPosition = {};
        gridPosition.x = offSetX + (i*w);
        gridPosition.y = offSetY + (j*h);

        gridPositions[ids[counter]] = gridPosition;

        counter++;
        i++;
    }

    return gridPositions;
  }

  //esta funcion recibe un arreglo de los objetos agrupados por tipo
  //se definen los tamaños de los elementos
  //y el offset
  //regresa un arreglo con las posiciones para cada objeto por su id.
  this.generaClustersDePosicionesPorTipo = function(offsetX,offsetY,canvasW,canvasH,w,h,groups,spaceBetweenGroups){
    
    var positions = {};
    var position={};
    var groupCounter = 0;
    var counter = 0;
    var currX = offsetX;
    var currY = offsetY;
    var group;  

    //ordena el arreglo por tamaño de grupos
    var sortable = [];
    for (var groupName in groups){
      group = groups[groupName];
      sortable.push([groupName, group.length])}
    sortable.sort(function(a, b) {return b[1] - a[1]});

    for(var j=0;j<sortable.length;j++)
    {
      group = groups[sortable[j][0]];

    /*  if((currX + (group.length*w))> canvasW){
        currX = offsetX;
        currY+= h;
      }*/

      for(var i=0;i<group.length;i++){
        if(currX >= canvasW-w)
        {
          currX = offsetX;
          currY += h;
        }
        
        position = {};
        position.x = currX;
        position.y = currY ;

        currX += w;
        positions[group[i].id] = position;
      }

      //currX += spaceBetweenGroups;
      currX = offsetX;
      currY += h;
    }
    return positions;

  }

  this.generaGridDeHexagonos = function(){

  }

  this.generaRenglones = function(offSetX,offSetY,h,ids){
    var gridPositions = {};
    var gridPosition = {};
    var counter = 0;

    while(counter < ids.length)
    {
      
        gridPosition = {};
        gridPosition.x = offSetX;
        gridPosition.y = offSetY + (counter*h);

        gridPositions[ids[counter]] = gridPosition;
        counter++;
    }

    return gridPositions;
  }
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



function getHospitalsDataOfIds(ids){
  var returnObj={};
  ids.forEach(function(id){
    returnObj[id] = hospitales_datos[id];
  })

  return returnObj;
}

function getHospitalsDataOfIds(ids,year){
  var returnObj={};
  ids.forEach(function(id){
    
    returnObj[id] = createObjectToArray(hospitales_datos[id][year]);
  })

  return returnObj;
}
//------------ARRAY--------------------
Array.max = function( array ){
    return Math.max.apply( Math, array );
};

//-----OBJECT------------
