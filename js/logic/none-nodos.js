/*
class Nodo{
    constructor(element, options){
        this.element = element;
        this.options = options;
    }
}
*/


export class Nodo {
  constructor(valor) {
    this.valor = valor;
    this.hijos = [];
  }

  agregarHijo(nodo) {
    this.hijos.push(nodo);
  }

  obtenerHijos() {
    return this.hijos;
  }

  obtenerValor() {
    return this.valor;
  }
}
