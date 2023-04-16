
cFinal = null;
document.addEventListener("DOMContentLoaded", (e) => {
  crearCuadricula();
  //ROJO
  arrInicio = [1];
  //NEGRO
  arrObstaculos = [
    5, 30, 45, 50, 55, 62, 63, 64, 65, 66, 74, 75, 80, 83, 98, 99, 105, 122,
    123, 147, 176, 185, 186, 190, 202, 209, 210, 228, 233, 234, 243, 254, 257,
    258, 269, 280, 281, 282, 295, 314, 321, 338, 339, 340, 347, 362, 363, 365,
    366, 388, 389, 390, 414, 426, 427, 428, 429, 455, 456, 457, 470, 475, 449,
    483, 484, 485, 494, 496, 520, 528, 553, 564, 565, 578, 590, 594, 603, 619,
    624, 625,
  ];
  //AZUL
  arrAgua = [
    118, 134, 143, 159, 168, 179, 180, 181, 182, 183, 184, 190, 193, 272, 273,
    274, 308, 309, 310, 311, 318, 319, 342, 343, 344, 367, 368, 419, 444, 469,
    488, 512, 513, 535, 536, 537, 560, 561, 572, 584, 597, 608, 622,
  ];
  //VERDE
  arrPasto = [
    35, 82, 107, 132, 137, 138, 139, 140, 141, 166, 191, 216, 241, 357, 383,
    399, 400, 409, 435, 436, 462, 524, 525, 549, 550, 575, 612,
  ];

  pintarObstaculos(arrInicio, arrObstaculos, arrAgua, arrPasto);
  handlerElegirCuadro();
});

function crearCuadricula() {
  let cuadricula = document.querySelector("#cuadricula");
  let htmlContent = "";
  for (let i = 0; i < 25; i++) {
    htmlContent += "<tr>";
    for (let j = 1; j <= 25; j++) {
      htmlContent += "<td class='libre' id='c" + (i * 25 + j) + "'></td>";
    }
    htmlContent += "</tr>";
  }
  cuadricula.innerHTML = htmlContent;
}

function pintarObstaculos(arrInicio, arrObstaculos, arrAgua, arrPasto) {
  arrInicio.forEach((element) => {
    document.getElementById("c" + element).classList.replace("libre", "inicio");
  });
  arrObstaculos.forEach((element) => {
    document
      .getElementById("c" + element)
      .classList.replace("libre", "obstaculo");
  });
  arrAgua.forEach((element) => {
    document.getElementById("c" + element).classList.replace("libre", "agua");
  });
  arrPasto.forEach((element) => {
    document.getElementById("c" + element).classList.replace("libre", "pasto");
  });
}

function handlerElegirCuadro() {
  let elements = document.querySelectorAll(".libre, .pasto, .agua");
  elements.forEach((element) => {
    element.addEventListener("click", function () {
      if (cFinal == null) {
        element.classList.replace(element.className, "final");
        cFinal = parseInt(element.id.replace("c", ""));
        console.log(cFinal);
      } else {
        console.log("Ya esta seleccionado");
      }
    });
  });
}
