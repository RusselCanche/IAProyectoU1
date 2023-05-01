/* global Graph, astar, $ */
$(function () {
  var $grid = $("#search_grid");

  var opts = {
    wallFrequency: 0.1,
    gridSize: 25,
    debug: true,
    diagonal: true,
    closest: false,
  };
  //NO MOVERLE XD
  var grid = new GraphSearch($grid, opts, astar.search);
  grid.initialize();
  grid.setOption({ diagonal: true });
  grid.graph.diagonal = true;
});

var css = { start: "start", finish: "finish", wall: "wall", active: "active" };
function GraphSearch($graph, options, implementation) {
  this.$graph = $graph;
  this.search = implementation;
  this.opts = $.extend(
    { wallFrequency: 0.1, debug: true, gridSize: 25 },
    options
  );
  this.initialize();
}
GraphSearch.prototype.setOption = function (opt) {
  this.opts = $.extend(this.opts, opt);
  this.drawDebugInfo();
};
GraphSearch.prototype.initialize = function () {
  this.grid = [];
  var self = this,
    nodes = [],
    $graph = this.$graph;

  $graph.empty();

  var cellWidth = $graph.width() / this.opts.gridSize - 2, // -2 for border
    cellHeight = $graph.height() / this.opts.gridSize - 2,
    $cellTemplate = $("<span />")
      .addClass("grid_item")
      .width(cellWidth)
      .height(cellHeight),
    startSet = false;
  var conteo = 0;
  for (var x = 0; x < this.opts.gridSize; x++) {
    var $row = $("<div class='clear' />"),
      nodeRow = [],
      gridRow = [];

    for (var y = 0; y < this.opts.gridSize; y++) {
      var id = "cell_" + x + "_" + y,
        $cell = $cellTemplate.clone();
      $cell.attr("id", id).attr("x", x).attr("y", y);
      $row.append($cell);
      gridRow.push($cell);
      //TODO: Agregar demas arrays de obstaculos

      if (arrObstaculos.includes(conteo)) {
        nodeRow.push(PARED);
        $cell.addClass(css.wall);
      } else {
        var cell_weight = null;
        if (arrAgua.includes(conteo)) {
          cell_weight = AGUA;
        }
        if (arrPasto.includes(conteo)) {
          cell_weight = PASTO;
        }
        //TODO: Checar los costos de celda
        nodeRow.push(cell_weight);
        $cell.addClass("weight" + cell_weight);
        //TODO: PENDIENTE INICIALIZAR VISUALIZACION DEL COSTO
        if ($("#displayWeights").prop("checked")) {
          console.log(`cell_weight: ${cell_weight}`);
        }
        //SE INICIA AL PRINCIPIO DE LA MATRIZ
        if (!startSet) {
          $cell.addClass(css.start);
          startSet = true;
        }
      }
      conteo++;
    }
    $graph.append($row);

    this.grid.push(gridRow);
    nodes.push(nodeRow);
  }

  this.graph = new Graph(nodes);

  // bind cell event, set start/wall positions
  this.$cells = $graph.find(".grid_item");
  this.$cells.click(function () {
    self.cellClicked($(this));
  });
};
GraphSearch.prototype.cellClicked = function ($end) {
  var end = this.nodeFromElement($end);
  if ($end.hasClass(css.wall) || $end.hasClass(css.start)) {
    return;
  }

  this.$cells.removeClass(css.active); //QUITAR CUADROS ACTIVOS DE RUTA
  this.$cells.removeClass(css.finish);
  $end.addClass("finish");
  var $start = this.$cells.filter("." + css.start),
    start = this.nodeFromElement($start);

  var sTime = performance ? performance.now() : new Date().getTime();

  var path = this.search(this.graph, start, end, {
    closest: this.opts.closest,
  });
  var fTime = performance ? performance.now() : new Date().getTime(),
    duration = (fTime - sTime).toFixed(2);

  if (path.length === 0) {
    $("#message").text("couldn't find a path (" + duration + "ms)");
    this.animateNoPath();
    this.$cells.html(" "); //LIMPIAR CELDAS
  } else {
    $("#message").text("search took " + duration + "ms.");
    this.drawDebugInfo();
    this.animatePath(path);
  }
};
GraphSearch.prototype.drawDebugInfo = function () {
  this.$cells.html(" ");
  var that = this;
  if (this.opts.debug) {
    that.$cells.each(function () {
      var node = that.nodeFromElement($(this)),
        debug = false;
      if (node.visited) {
        debug = "F: " + node.f + "<br />G: " + node.g + "<br />H: " + node.h;
      }

      if (debug) {
        $(this).html(debug);
      }
    });
  }
};
GraphSearch.prototype.nodeFromElement = function ($cell) {
  return this.graph.grid[parseInt($cell.attr("x"))][parseInt($cell.attr("y"))];
};
GraphSearch.prototype.animateNoPath = function () {
  var $graph = this.$graph;
  var jiggle = function (lim, i) {
    if (i >= lim) {
      $graph.css("top", 0).css("left", 0);
      return;
    }
    if (!i) i = 0;
    i++;
    $graph.css("top", Math.random() * 6).css("left", Math.random() * 6);
    setTimeout(function () {
      jiggle(lim, i);
    }, 5);
  };
  jiggle(15);
};
//MODIFICAR PARA QUE LA ANIMACION AL TERMINAR SE MANTENGA EL INICIO.
GraphSearch.prototype.animatePath = function (path) {
  var grid = this.grid,
    timeout = 1000 / grid.length, // no quitar la division
    elementFromNode = function (node) {
      return grid[node.x][node.y];
    };
  var self = this;
  var addClass = function (path, i) {
    if (i >= path.length - 1) {
      return;
    }
    elementFromNode(path[i]).addClass(css.active);
    addClass(path, i + 1);
  };

  addClass(path, 0);
};
