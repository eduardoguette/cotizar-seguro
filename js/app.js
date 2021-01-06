// constructores

function Seguro(marca, year, tipo) {
  this.marca = marca;
  this.year = year;
  this.tipo = tipo;
}

Seguro.prototype.cotizarSeguro = function () {
  /* 
    1. Americano = 1.15
    2. Asiatico  = 1.05
    3. Europeo = 1.35

  */
  let cantidad;
  const base = 2000;
  switch (this.marca) {
    case "1":
      cantidad = base * 1.15;
      break;
    case "2":
      cantidad = base * 1.05;
      break;
    case "3":
      cantidad = base * 1.35;
      break;
    default:
      break;
  }

  // Leer el año
  const diferencia = new Date().getFullYear() - this.year;

  // Cada año que la diferencia es mayor, el coste se reduce un 3%
  cantidad -= (diferencia * 3 * cantidad) / 100;

  /* 
  Si el seguro es básico se multiplica por un 30% más.
  Si el seguro es completo se multiplica por un 50% más
*/

  if (this.tipo === "basico") {
    cantidad *= 1.3;
  } else {
    cantidad *= 1.5;
  }

  return cantidad;
};

function UI() {}

// Llena las opciones de los años
UI.prototype.llenarOpciones = () => {
  const max = new Date().getFullYear();
  const min = max - 20;

  const selectYear = document.getElementById("year");

  for (let i = max; i >= min; i--) {
    let option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    selectYear.appendChild(option);
  }
};

// Muestra alertas en pantalla
UI.prototype.mostrarMensaje = (mensaje, tipo) => {
  const div = document.createElement("div");
  if (tipo === "error") {
    div.classList.add("error");
  } else {
    div.classList.add("correcto");
  }
  div.classList.add("mensaje", "mt-10");
  div.textContent = mensaje;

  const formulario = document.getElementById("cotizar-seguro");
  formulario.insertBefore(div, document.getElementById("resultado"));

  setTimeout(() => {
    div.remove();
  }, 2000);
};

UI.prototype.mostrarResultado = (seguro, total) => {
  const { marca, year, tipo } = seguro;

  let textoMarca;

  switch (marca) {
    case "1":
      textoMarca = "Americano"
      break;
    case "2":
      textoMarca = "Asiatico"
      break;
    case "3":
      textoMarca = "Europeo"
      break;

    default:
      break;
  }

  // crear el reesultado
  const div = document.createElement("div");
  div.classList.add("mt-10");

  div.innerHTML = `
    <p class="header">Tu resumen:</p>
    
    <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
    <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
    <p class="font-bold">Tipo: <span class="font-normal capitalize">${tipo}</span></p>
    <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
  `;
  const spinner = document.getElementById("cargando");
  spinner.classList.remove("hidden");

  const resultado = document.getElementById("resultado");

  setTimeout(() => {
    spinner.classList.add("hidden");

    resultado.appendChild(div);
  }, 2000);
};

// instanciar UI
const ui = new UI();

document.addEventListener("DOMContentLoaded", () => {
  ui.llenarOpciones(); //Llena el select con los años
});

(function eventListeners() {
  const formulario = document.getElementById("cotizar-seguro");
  formulario.addEventListener("submit", cotizarSeguro);
})();

function cotizarSeguro(e) {
  e.preventDefault();
  // validar marca
  const marca = document.getElementById("marca").value;

  // validar año
  const year = document.getElementById("year").value;

  // valiar tipo de seguro
  const tipoSeguro = document.querySelector('input[type="radio"]:checked')
    .value;

  if (marca === "" || year === "" || tipoSeguro === "") {
    ui.mostrarMensaje("Todos los campos son obligatorios", "error");
    return;
  }
  ui.mostrarMensaje("Cotizando...", "correcto");

  // ocultar las cotizaciones previas
  const resultados = document.querySelector("#resultado div");
  if (resultados != null) {
    resultados.remove();
  }

  // instanciar seguro
  const seguro = new Seguro(marca, year, tipoSeguro);
  const total = seguro.cotizarSeguro();
  ui.mostrarResultado(seguro, total);
}
