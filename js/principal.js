
// FUNCIÓN ANÓNIMA PARA LAS PROPIEDADES DE LA CUADRÍCULA
$(function () {
  var $cuadricula = $("#search_grid");
  var opciones = {
    gridSize: 25, // tamaño de cuadricula (25x25)
    debug: true, // visualizacion de datos (F,G,H) en cuadricula
    diagonal: true, // Si el camino puede ir en diagonal
  };
  // Definir la CLASE BusquedaGrafica con las propiedades establecidas, astar hace referencia a otro archivo
  var grid = new BusquedaGrafica($cuadricula, opciones, astar.search);
  grid.initialize(); // inicializamos los valores que tenemos para graficar
  grid.graph.diagonal = true; // el camino se va en diagonal
});
// preparamos el css en los valores que tendrá por defecto
var css = { start: "start", finish: "finish", wall: "wall", active: "active" }; 
// Definimos el constructor de la clase, para inicializarla con los valores correspondientes
function BusquedaGrafica($grafica, opciones, implementacion) {
  this.$grafica = $grafica;
  this.search = implementacion;
  this.opciones = $.extend({ debug: true, gridSize: 25 }, opciones); // recibe los parametros d elas opciones 
  this.initialize();
}
//agrega las opciones de los datos de celdas
BusquedaGrafica.prototype.setOption = function (opt) {
  this.opciones = $.extend(this.opciones, opt);
  this.drawDebugInfo(); // dibuja las opciones que le habiamos mandado
};

// método anónimo para inicializar desde cero, por defecto
BusquedaGrafica.prototype.initialize = function () {
  this.grid = [];
  var self = this, nodos = [], $grafica = this.$grafica;
  $grafica.empty();

  var largoCelda = $grafica.width() / this.opciones.gridSize - 2,
      altoCelda = $grafica.height() / this.opciones.gridSize - 2,
      $plantillaCelda = $("<span />")
        .addClass("grid_item")
        .width(largoCelda)
        .height(altoCelda),
    tieneInicio = false;
  var conteo = 0;
  
  // va ir generando la cuadrícula en fila (horizontal)
    for (var x = 0; x < this.opciones.gridSize; x++) {
    var $fila = $("<div class='clear' />"),
      nodoFila = [], // agrega los nodos correspondientes
      cuadriculaFila = [];

       // genera las cuadrículas de manera vertical
    for (var y = 0; y < this.opciones.gridSize; y++) {
      var id = "cell_" + x + "_" + y, $celda = $plantillaCelda.clone();
      $celda.attr("id", id).attr("x", x).attr("y", y);
      $fila.append($celda);
      cuadriculaFila.push($celda);

      // Pintar obstaculos: Pared, agua, pasto 
      if (arrObstaculos.includes(conteo)) {
        nodoFila.push(PARED);
        $celda.addClass(css.wall);
      } else {
        var costoCelda = null;
        if (arrAgua.includes(conteo)) {
          costoCelda = AGUA;
        }
        if (arrPasto.includes(conteo)) {
          costoCelda = PASTO;
        }
        
        // agregamos los costos al arreglo y agregamos estilo a las celdas
        nodoFila.push(costoCelda);
        $celda.addClass("weight" + costoCelda);
        
        //SE INICIA AL PRINCIPIO DE LA MATRIZ
        if (!tieneInicio) {
          $celda.addClass(css.start);
          tieneInicio = true;
        }
      }
      conteo++; // controla el conteo de las celdas
    }

    $grafica.append($fila);
    this.grid.push(cuadriculaFila);
    nodos.push(nodoFila);
  }
  //grafica todos los nodos ()
  this.graph = new Graph(nodos);

  // se busca entre todas las celdas para darle el evento al momento que se cliclea la celda y se asa el parametro de la celda
  
  // Buscar todas las celdas de la cuadricula y agregar el evento click en cada una.
  this.$celdas = $grafica.find(".grid_item");
  this.$celdas.click(function () {
    self.cellClicked($(this));
  });
};
BusquedaGrafica.prototype.cellClicked = function ($fin) {
  var fin = this.nodeFromElement($fin);

  //Verificar que la celda seleccionada, no sea el inicio o un obstaculo pared
  if ($fin.hasClass(css.wall) || $fin.hasClass(css.start)) {
    return;
  }

  //Limpieza visual de los nodos para antes de la animacion de la solucion
  this.$celdas.removeClass(css.active);
  this.$celdas.removeClass(css.finish);
  $fin.addClass("finish");

  var $inicio = this.$celdas.filter("." + css.start),
    inicio = this.nodeFromElement($inicio);

  //var sTime = performance ? performance.now() : new Date().getTime();

  // te otorga los nodos de la solución 
  var ruta = this.search(this.graph, inicio, fin, {
    closest: this.opciones.closest,
  });

  // cuando no encunetra una solución o destino
  if (ruta.length === 0) {
    this.animateNoPath();
    this.$celdas.html(" ");
  } else {
    // cuando sí lo encuentra
    this.drawDebugInfo(); // dibuja los valores de la información de cada celda 
    this.animatePath(ruta);
  }
};

// para la función del despliegue de la información
BusquedaGrafica.prototype.drawDebugInfo = function () {
  this.$celdas.html(" ");
  var that = this;
  if (this.opciones.debug) {
    that.$celdas.each(function () {
      var nodo = that.nodeFromElement($(this)), debug = false;
      if (nodo.visited) {
        debug = "F: " + nodo.f + "<br />G: " + nodo.g + "<br />H: " + nodo.h;
      }
      if (debug) {
        $(this).html(debug);
      }
    });
  }
};

// extrae el elemento nodo f
BusquedaGrafica.prototype.nodeFromElement = function ($celda) {
  return this.graph.grid[parseInt($celda.attr("x"))][parseInt($celda.attr("y"))];
};

// cuando no enuentra la solución mueve la pantalla 
BusquedaGrafica.prototype.animateNoPath = function () {
  var $grafica = this.$grafica;
  var jiggle = function (lim, i) {
    if (i >= lim) {
      $grafica.css("top", 0).css("left", 0);
      return;
    }
    if (!i) i = 0;
    i++;
    $grafica.css("top", Math.random() * 6).css("left", Math.random() * 6);
    setTimeout(function () {
      jiggle(lim, i);
    }, 5);
  };
  jiggle(15);
};
//MODIFICAR PARA QUE LA ANIMACION AL TERMINAR SE MANTENGA EL INICIO, hace la animación del punto inicial al punto final de manera recursiva
BusquedaGrafica.prototype.animatePath = function (ruta) {
  var grid = this.grid,
      elementFromNode = function (node) {
        return grid[node.x][node.y];
      };
  var addClass = function (ruta, i) {
    if (i >= ruta.length - 1) {
      return;
    }
    elementFromNode(ruta[i]).addClass(css.active);
    addClass(ruta, i + 1);
  };

  addClass(ruta, 0);
};
