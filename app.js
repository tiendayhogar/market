"use strict";

// Tasa de cambio: 1 USD equivale a 340.0 CUP (ajusta según necesites)
const tasaCambio = 340.0;

// Ubicaciones disponibles
const ubicaciones = {
  provincias: {
    "Artemisa": {
      id: 1,
      municipios: {
        "Bahía Honda": 1,
        "San Cristóbal": 2,
        "Candelaria": 3,
        "Artemisa": 4,
        "Alquízar": 5,
        "Güira de Melena": 6,
        "San Antonio de los Baños": 7,
        "Bauta": 8,
        "Caimito": 9,
        "Guanajay": 10,
        "Mariel": 11,
      }
    },
    "Pinar Del Río": {
      id: 2,
      municipios: {
        "Los Palacios": 12,
        "Consolación": 13,
      }
    },
    "La Habana": {
  id: 3,
  municipios: {
    "Playa": 14,
    "La Lisa": 15,
    "Marianao": 16,
    "Boyeros": 17,
    "Cerro": 18,
    "Plaza de la Revolución": 19,
    "Centro Habana": 20,
    "La Habana Vieja": 21,
    "Diez de Octubre": 22,
    "Arroyo Naranjo": 23,
  
  }
},
},
  provinciaSeleccionada: null,
  municipioSeleccionado: null
};

// Función unificada para mostrar el modal de ubicación
function mostrarModalUbicacion() {
  const modal = document.createElement('div');
  modal.id = 'modal-ubicacion';
  modal.className = 'modal';
  
  modal.innerHTML = `
    <div class="modal-content ubicacion-modal">
      <span class="close">&times;</span>
      <div id="paso-provincia" class="paso-activo">
        <h3>Seleccione su provincia</h3>
        <select id="select-provincia" class="form-select">
          <option value="">Seleccione una provincia</option>
          ${Object.keys(ubicaciones.provincias).map(provincia => 
            `<option value="${provincia}" ${ubicaciones.provinciaSeleccionada === provincia ? 'selected' : ''}>${provincia}</option>`
          ).join('')}
        </select>
      </div>
      <div id="paso-municipio" class="paso-oculto">
        <h3>Seleccione su municipio en <span id="nombre-provincia"></span></h3>
        <select id="select-municipio" class="form-select">
          <option value="">Seleccione un municipio</option>
        </select>
      </div>
      <div class="botones-ubicacion">
        <button id="btn-atras" class="btn-ubicacion oculto">Atrás</button>
        <button id="btn-siguiente" class="btn-ubicacion" ${!ubicaciones.provinciaSeleccionada ? 'disabled' : ''}>Siguiente</button>
        <button id="btn-confirmar" class="btn-ubicacion oculto">Confirmar</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
  
  // Configurar eventos
  const selectProvincia = modal.querySelector('#select-provincia');
  const selectMunicipio = modal.querySelector('#select-municipio');
  const btnSiguiente = modal.querySelector('#btn-siguiente');
  const btnAtras = modal.querySelector('#btn-atras');
  const btnConfirmar = modal.querySelector('#btn-confirmar');
  
  // Si ya hay provincia seleccionada, cargar municipios
  if (ubicaciones.provinciaSeleccionada) {
    cargarMunicipios(ubicaciones.provinciaSeleccionada);
  }
  
  selectProvincia.addEventListener('change', function() {
    ubicaciones.provinciaSeleccionada = this.value;
    btnSiguiente.disabled = !this.value;
  });
  
  btnSiguiente.addEventListener('click', function() {
    if (!ubicaciones.provinciaSeleccionada) {
      alert('Por favor seleccione una provincia');
      return;
    }
    
    cargarMunicipios(ubicaciones.provinciaSeleccionada);
    
    // Mostrar paso municipio
    document.getElementById('paso-provincia').classList.remove('paso-activo');
    document.getElementById('paso-provincia').classList.add('paso-oculto');
    document.getElementById('paso-municipio').classList.remove('paso-oculto');
    document.getElementById('paso-municipio').classList.add('paso-activo');
    document.getElementById('nombre-provincia').textContent = ubicaciones.provinciaSeleccionada;
    
    // Actualizar botones
    btnSiguiente.classList.add('oculto');
    btnAtras.classList.remove('oculto');
    btnConfirmar.classList.remove('oculto');
    
    // Seleccionar municipio si ya estaba guardado
    if (ubicaciones.municipioSeleccionado) {
      selectMunicipio.value = ubicaciones.municipioSeleccionado;
    }
  });
  
  btnAtras.addEventListener('click', function() {
    // Volver a paso provincia
    document.getElementById('paso-municipio').classList.remove('paso-activo');
    document.getElementById('paso-municipio').classList.add('paso-oculto');
    document.getElementById('paso-provincia').classList.remove('paso-oculto');
    document.getElementById('paso-provincia').classList.add('paso-activo');
    
    // Actualizar botones
    btnSiguiente.classList.remove('oculto');
    btnAtras.classList.add('oculto');
    btnConfirmar.classList.add('oculto');
  });
  
  btnConfirmar.addEventListener('click', function() {
    const municipioSeleccionado = parseInt(selectMunicipio.value);
    if (!municipioSeleccionado) {
      alert('Por favor seleccione un municipio');
      return;
    }
    
    guardarUbicacion(ubicaciones.provinciaSeleccionada, municipioSeleccionado);
    modal.style.display = 'none';
    modal.remove();
  });
  
  modal.querySelector('.close').addEventListener('click', function() {
    modal.style.display = 'none';
    modal.remove();
  });
  
  function cargarMunicipios(provincia) {
    const municipios = ubicaciones.provincias[provincia].municipios;
    
    selectMunicipio.innerHTML = '<option value="">Seleccione un municipio</option>' +
      Object.keys(municipios).map(municipio => 
        `<option value="${municipios[municipio]}" ${ubicaciones.municipioSeleccionado === municipios[municipio] ? 'selected' : ''}>${municipio}</option>`
      ).join('');
  }
}

function guardarUbicacion(provincia, municipioId) {
  ubicaciones.provinciaSeleccionada = provincia;
  ubicaciones.municipioSeleccionado = municipioId;
  localStorage.setItem('municipioSeleccionado', municipioId);
  
  // Actualizar el botón en el header
  const nombreMunicipio = obtenerNombreMunicipio(municipioId);
  const ubicacionBtn = document.getElementById('ubicacion-actual');
  if (ubicacionBtn) {
    ubicacionBtn.textContent = `${provincia}, ${nombreMunicipio}`;
  }
  
  // Recargar productos
  renderizarProductos();
  renderizarOfertas();
  renderizarProductosRecientes();
  renderizarCombosTemporales();
}

function obtenerNombreMunicipio(id) {
  for (const provincia in ubicaciones.provincias) {
    for (const municipio in ubicaciones.provincias[provincia].municipios) {
      if (ubicaciones.provincias[provincia].municipios[municipio] === id) {
        return municipio;
      }
    }
  }
  return '';
}

function cargarUbicacionGuardada() {
  const municipioGuardado = localStorage.getItem('municipioSeleccionado');
  if (!municipioGuardado) return false;
  
  // Buscar la provincia correspondiente al municipio
  for (const provincia in ubicaciones.provincias) {
    for (const municipio in ubicaciones.provincias[provincia].municipios) {
      if (ubicaciones.provincias[provincia].municipios[municipio] == municipioGuardado) {
        ubicaciones.provinciaSeleccionada = provincia;
        ubicaciones.municipioSeleccionado = parseInt(municipioGuardado);
        
        // Actualizar el botón en el header
        const ubicacionBtn = document.getElementById('ubicacion-actual');
        if (ubicacionBtn) {
          ubicacionBtn.textContent = `${provincia}, ${municipio}`;
        }
        return true;
      }
    }
  }
  return false;
}

// Modificación del DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  // Verificar si estamos en la página del carrito
  const isCartPage = window.location.pathname.includes("cart.html");
  
  // Cargar ubicación guardada (si existe)
  const tieneUbicacion = cargarUbicacionGuardada();
  
  // Mostrar modal solo si no hay ubicación guardada Y no estamos en el carrito
  if (!tieneUbicacion && !isCartPage) {
    mostrarModalUbicacion();
  }
  
  // Configurar botón para cambiar ubicación
  document.getElementById('cambiar-ubicacion')?.addEventListener('click', mostrarModalUbicacion);
  
  // Resto de tu inicialización...
  cargarCarritoDesdeLocalStorage();
  
  if (productosContainer) {
    renderizarProductos();
    // ... (código existente de filtros)
  }
  
  renderizarCombosTemporales();
  renderizarOfertas();
  renderizarProductosRecientes();
});

/// Obtener directamente el ref desde la URL actual, sin guardar en localStorage
function obtenerVendedorDesdeURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const ref = urlParams.get("ref");
  return ref ? ref : null;
}


// Lista de productos (solo un ejemplo, añade el resto de tus productos siguiendo este formato)
const productos = [
  // Ejemplo de producto con atributo municipios
  
  {
    id: 1,
    nombre: " Carne de Res 2da Cat troceada ",
    precio: 14.40,
    imagen: "res.png",
    description: "Bolsa de 1 Kg ",
    categoria: "Alimentos/Cárnicos",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ]
  },
  /*{
    id: 2,
    nombre: "Caja de Pollo",
    precio: 52,
    imagen: "pollocaja.png",
    description: "caja de 40 lb de muslo y contramuslo 4 paquetes de 10 lb",
    categoria: "Alimentos/Cárnicos",
     reciente: 0,
     descuento: 10,
     municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },
  {
    id: 75,
    nombre: "Caja de Pollo",
    precio: 49,
    imagen: "caja33lbpollo.png",
    description: "caja de 33 lb de muslo y contramuslo 3 paquetes de 11 lb",
    categoria: "Alimentos/Cárnicos",
    
     descuento: 10,
     municipios: [1, 2, 3, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },
  {
    id: 3,
    nombre: "Paquete de pollo 10 lb ",
    precio: 13,
    imagen: "pollopqte.png",
    description: "paquete de 10 lb de muslo y contra muslo",
    categoria: "Alimentos/Cárnicos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 77,
    nombre: "Paquete de pollo 11 lb ",
    precio: 14,
    imagen: "pollopqte.png",
    description: "paquete de 11 lb de muslo y contra muslo",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },*/
{
  id: 4,
  nombre: "Lomo de cerdo deshuesado",
  precio: 12,
  imagen: "lomo.png",
  description: "Lomo de cerdo Importado sellado en bolsa de 3 lb",
  categoria: "Alimentos/Cárnicos",
  municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, // Artemisa
    12, 13,                           // Pinar del Río
    14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 // La Habana
  ]
},
 /* {
    id: 92,
    nombre: "Muslo de pollo ahumado ",
    precio: 7 ,
    imagen: "polloahumado.png",
    description: "Bolsa de 3 Lb ",
    categoria: "Alimentos/Cárnicos",
    reciente: 1,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

  },
  {
    id: 93,
    nombre: "Muslo de pollo ahumado ",
    precio: 12 ,
    imagen: "polloahumado.png",
    description: "Bolsa de 5 Lb ",
    categoria: "Alimentos/Cárnicos",
    reciente  : 1,
    municipios: [1, 2, 3,  12, 13, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]

  },

  {
    id: 5,
    nombre: "Masas de Cerdo",
    precio: 19,
    imagen: "masas.svg",
    description: "bolsa sellada al vacio de 4lb",
    categoria: "Alimentos/Cárnicos"
  },
  {
    id: 6,
    nombre: "Bistec de cerdo",
    precio: 10.5,
    imagen: "bistec.svg",
    description: "Bandeja de bistec sellada al vacio 2.2 lb",
    categoria: "Alimentos/Cárnicos"
  },*/
  {
    id: 8,
    nombre: "Jamon vicky",
    precio: 9.20,
    imagen: "vicky.png",
    description: "Porción de 3  lb sellado al vacio ",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
 /* {
    id: 9,
    nombre: "Lomo ahumado",
    precio: 12,
    imagen: "ahumado.png",
    description: "porcionado y sellado en 2 lb ",
    categoria: "Alimentos/Cárnicos",
    descuento:10,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
    
  },
  /*{
    id: 10,
    nombre: "Lomo Ahumado",
    precio: 8,
    imagen: "ahumado.svg",
    description: "bandeja sellada al vacio de 1.2 lb lasqueado",
    categoria: "Alimentos/Cárnicos"
  },*/                                                                                                          
  {
    id: 11,
    nombre: "Pechuga de pollo",
    precio: 16,
    imagen: "pechuga.png",
    description: "Paquete de 2 kg",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
 /* {
    id: 12,
    nombre: "Jamón Embuchado",
    precio: 12.00,
    imagen: "embuchado.png",
    description: "Porción sellada de 3 Lb",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },*/
  {
    id: 13,
    nombre: "Picadillo de pollo",
    precio: 2.40,
    imagen: "picadillo.png",
    description: "unidad de 400 gr",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 14,
    nombre: "Salchichas",
    precio: 1.90,
    imagen: "perritos.png",
    description: "paquete de 12 unidades",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  /*{
    id: 15,
    nombre: "Chorizo Tipo vela",
    precio: 3.20,
    imagen: "vela.svg",
    description: "x lb porcion sellada segun pedido del cliente",
    categoria: "Alimentos/Cárnicos"
  },*/
  {
    id: 16,
    nombre: "Atún",
    precio: 13,
    imagen: "atun.png",
    description: "Lata de 1 Kg en aceite",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
 /* {
    id: 101,
    nombre: "Hamburguesas Mixtas",
    precio: 2.3,
    imagen: "hamburguesas.png",
    description: "Bolsa de 5 Hamburguesas de 90 gr cada una", 
    categoria: "Alimentos/Cárnicos",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
  },*/
  // Alimentos/Líquidos
  {
    id: 17,
    nombre: "Cerveza Cristal",
    precio: 22,
    imagen: "cristal.png",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 129,
    nombre: "Whisky Old Star",
    precio: 5.80,
    imagen: "old.png",
    description: "Botella de 1 Lts",
    categoria: "Alimentos/Líquidos",
    reciente:1,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 18,
    nombre: "Cerveza Bucanero",
    precio: 22,
    imagen: "bucanero.png",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 19,
    nombre: "Cerveza Economica",
    precio: 16,
    imagen: "timber.png",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
 /* {
    id: 20,
    nombre: "Vino Acantus",
    precio: 5,
    imagen: "acantus.png",
    description: "Botella de vino rosado, tinto o Blanco",
    categoria: "Alimentos/Líquidos",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  {
    id: 21,
    nombre: "Vino Espumoso",
    precio: 10,
    imagen: "espumoso.png",
    description: "botella de vino espumoso Varons d Valls 750 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  {
    id: 22,
    nombre: "Ron Habana Club",
    precio: 7.70,
    imagen: "3años.png",
    description: "Añejo 3 años 750 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },*/
  {
    id: 23,
    nombre: "Malta Guajira",
    precio: 6.50,
    imagen: "guajira.svg",
    description: "Blister de 6 uds de 500 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3,  12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 24,
    nombre: "Jugo",
    precio: 14.40,
    imagen: "200ml.png",
    description: "Caja de 24 uds de 200 ml",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 25,
    nombre: "Jugo",
    precio: 1.60,
    imagen: "naranja.png",
    description: "Jugo La estancia Sabor Naranja 1 L",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 26,
    nombre: "Jugo",
    precio: 6.50,
    imagen: "multifrutas.png",
    description: "Blister de 6 uds 330 ml Multifrutas de lata",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 27,
    nombre: "Malta Morena",
    precio: 18,
    imagen: "morena.png",
    description: "Caja de 24 uds",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 28,
    nombre: "Refresco",
    precio: 0.55,
    imagen: "cintracola.png",
    description: "Lata 330 ml",
    categoria: "Alimentos/Líquidos",
    reciente: 0,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 108,
    nombre: "Refresco",
    precio: 0.55,
    imagen: "cintranaranja.png",
    description: "Lata 330 ml",
    categoria: "Alimentos/Líquidos",
    reciente: 1,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 202,
    nombre: "Refresco Zuko",
    precio: 3.6,
    imagen: "zuko.png",
    description: "Caja de 8 sobres",
    categoria: "Alimentos/Líquidos",
   
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 29,
    nombre: "Refresco",
    precio: 1.90,
    imagen: "1.5lt.png",
    description: "Pomo de 2 Lt",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ],
  },
  {
    id: 30,
    nombre: "Café",
    precio: 5.5,
    imagen: "aroma.png",
    description: "Paquete de 250 gr",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 76,
    nombre: "Café Expreso ",
    precio: 5.5,
    imagen: "cafenezka.png",
    description: "Paquete de 250 gr",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ],
    
  },
  // Alimentos/Otros
  {
    id: 78,
    nombre: "Ajo Finamente picado Badia ",
    precio: 2.60,
    imagen: "ajobadia.png",
    description: "Pomo de 8 OZ ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },

  {
    id: 127,
    nombre: "Maíz dulce en granos  ",
    precio: 1.70,
    imagen: "maizdulce.png",
    description: "lata de 445 gr ",
    categoria: "Alimentos/Otros",
    reciente: 1,
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 80,
    nombre: "Jugo de Naranja Agria Badia ",
    precio: 2.60,
    imagen: "naranjabadia.png",
    description: "Pomo de 10 OZ ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 81,
    nombre: "ketchup kurtz ",
    precio: 2.95,
    imagen: "ketchupkurtz.png",
    description: "Pomo de 10 OZ ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 82,
    nombre: "Chicharos verdes Del Monte ",
    precio: 1.95,
    imagen: "chicharodelmonte.png",
    description: "Bolsa de 16 OZ ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 83,
    nombre: "Alubias Del Monte ",
    precio: 2.40,
    imagen: "alubiasdelmonte.png",
    description: "Bolsa de 16 OZ ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 84,
    nombre: "Lentejas Goya ",
    precio: 2.40,
    imagen: "lentejasgoya.png",
    description: "Bolsa de 14 OZ ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 85,
    nombre: "Garbanzos Goya ",
    precio: 2.95,
    imagen: "garbanzosgoya.png",
    description: "Bolsa de 14 OZ ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  /*{
    id: 86,
    nombre: "Mantequilla de Maní",
    precio: 4.95,
    imagen: "mantequillamani.png",
    description: "Pomo de 16 OZ ",
    categoria: "Alimentos/Otros",
    reciente: 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 87,
    nombre: "Botella de Aceite",
    precio: 3.50,
    imagen: "aceite.png",
    description: "Pomo de 1 L ",
    categoria: "Alimentos/Otros",
    reciente: 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },*/
  {
    id: 88,
    nombre: "Compota Babe",
    precio: 0.90,
    imagen: "compota.png",
    description: "Pomito de 4 Oz ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 89,
    nombre: "Vinagre Goya ",
    precio: 1.95,
    imagen: "vinagregoya.png",
    description: " Pomo de 16 Oz ",
    categoria: "Alimentos/Otros",
    reciente: 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 90,
    nombre: "Sazón Tropical Badia ",
    precio: 3.40,
    imagen: "tropicalcarnes.png",
    description: "Cajita de 20 Uds Ideal para carnes  ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 91,
    nombre: "Sazón Tropical Badia.  ",
    precio: 3.40,
    imagen: "tropicalarroz.png",
    description: "Cajita de 20 Uds Ideal para Arroces y Cardos  ",
    categoria: "Alimentos/Otros",
    reciente: 0,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },

  {
    id: 31,
    nombre: "pasta de tomate Sabrosísimo",
    precio: 3.50,
    imagen: "800gr.png",
    description: "Pasta doble concentrado 800 gr",
    categoria: "Alimentos/Otros",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 112,
    nombre: "Pure de Tomate Sara",
    precio: 1.65,
    imagen: "puresara.png",
    description: "Pure de Tomate 400 gr",
    categoria: "Alimentos/Otros",
    reciente : 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
   {
    id: 115,
    nombre: "Tomate Frito Apis",
    precio:2.2 ,
    imagen: "tomatefrito.png",
    description: "Caja de  400 gr",
    categoria: "Alimentos/Otros",
    reciente : 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
   {
    id: 113,
    nombre: "Pure de Papas Deshidratadas",
    precio: 6.40,
    imagen: "purepapa.png",
    description: "Pure de Papas 390 gr para 18 porciones ",
    categoria: "Alimentos/Otros",
    reciente : 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 32,
    nombre: "Pomo de Garbanzos Cocidos",
    precio: 2.20,
    imagen: "garbanzos.png",
    description: "Pomo de 540 gr",
    categoria: "Alimentos/Otros",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ] 
  },
  {
    id: 33,
    nombre: "Mayonesa Saude",
    precio: 3.00,
    imagen: "mayonesasaude.png",
    description: "Pomo de 500 gr",
    categoria: "Alimentos/Otros",
    reciente:1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
    {
    id: 109,
    nombre: "Pomo de Aceitunas",
    precio: 3.00,
    imagen: "aceituna290gr.png",
    description: "Pomo de 290 gr",
    categoria: "Alimentos/Otros",
    reciente:1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 34,
    nombre: "Sazón Completo Nezka ",
    precio: 4.20,
    imagen: "sazonmixto.png",
    description: "Pomo de 250 gr",
    categoria: "Alimentos/Otros",
   
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 35,
    nombre: "Spaguetis",
    precio: 1.55,
    imagen: "spaguetis.png",
    description: "Bolsa de 500 gr",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 36,
    nombre: "Codito",
    precio: 1.55,
    imagen: "codito.png",
    description: "Bolsa de 500 gr",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 37,
    nombre: "Azucar Blanca",
    precio: 2,
    imagen: "azucar1kg.png",
    description: "bolsa de 1 kg",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    },
  {
    id: 38,
    nombre: "Frijol Negro ",
    precio: 8,
    imagen: "frijol5lb.png",
    description: "bolsa de 5 Lb",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 39,
    nombre: "Frijol Negro ",
    precio: 3.2,
    imagen: "frijol1kg.png",
    description: "bolsa de 1 kg",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 40,
    nombre: "Frijol Colorado ",
    precio: 8,
    imagen: "colorados5lb.png",
    description: "bolsa de 5 Lb",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 41,
    nombre: "Sal Iodada ",
    precio: 0.5,
    imagen: "sal.png",
    description: "bolsa de 1 Lb",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 42,
    nombre: "Arroz Brasileño",
    precio: 2.2,
    imagen: "arroz1kg.png",
    description: "bolsa de 1 kg",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 43,
    nombre: "Fideos",
    precio: 1.80,
    imagen: "fideos.png",
    description: "bolsa de 500 gr",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
 {
    id: 38,
    nombre: "Sopa Intantanea",
    precio: 0.70,
    imagen: "sopa.png",
    description: "Sabor pollo sobre 75 gr",
    categoria: "Alimentos/Otros",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ],
   
  },
  {
    id: 44,
    nombre: "Zumo de Limón ",
    precio: 2.25,
    imagen: "zumo.png",
    description: "Botella de 1l",
    categoria: "Alimentos/Otros",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ],
    
  },
  {
    id: 45,
    nombre: "Cartón de huevos",
    precio: 10.20,
    imagen: "huevo.png",
    description: "30 uds frescos 100 % orgánicos",
    categoria: "Alimentos/Otros",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 201,
    nombre: "Gelatina ",
    precio: 1.10,
    imagen: "gelatina.png",
    description: "Bolsa de gelatina 75 gr ",
    categoria: "Alimentos/Otros",
    
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 74,
    nombre: "Mayonesa Nezka  ",
    precio: 3.20,
    imagen: "mayonezka.png",
    description: "pomo de 500  gr ",
    categoria: "Alimentos/Otros",
    
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  // Lácteos
  /*{
    id: 41,
    nombre: "Queso Gouda",
    precio: 13.5,
    imagen: "queso.png",
    description: "Porción de 1 kg sellado",
    categoria: "Alimentos/Lácteos"
  },*/
  {
    id:102 ,
    nombre: "Yogurt Probiótico",
    precio: 13.5,
    imagen: "yogurt.png",
    description: "Cubeta de 4L",
    categoria: "Alimentos/Lácteos",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
 /* {
    id: 43,
    nombre: "Queso Crema",
    precio: 4.20,
    imagen: "crema.png",
    description: "Pote de 300 gr",
    categoria: "Alimentos/Lácteos"
  },*/
  {
    id: 404,
    nombre: "Helado",
    precio: 12,
    imagen: "helado.png",
    description: "Caja de 4L",
    categoria: "Alimentos/Lácteos",
    descuento: 10,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 100,
    nombre: "Leche en Polvo",
    precio: 10,
    imagen: "lechepolvo.png",
    description: "Bolsa de 1 kg",
    categoria: "Alimentos/Lácteos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 46,
    nombre: "Leche Condensada",
    precio: 1.90,
    imagen: "condensada.png",
    description: "Lata con abre fácil",
    categoria: "Alimentos/Lácteos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
 
  // Del Agro
  {
    id: 47,
    nombre: "Ajo",
    precio: 4.7,
    imagen: "ajo.png",
    description: "Bolsa de 10 cabezas",
    categoria: "Alimentos/Del Agro",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 48,
    nombre: "Malanga",
    precio: 3,
    imagen: "malanga.png",
    description: "bolsa de 5 lb",
    categoria: "Alimentos/Del Agro",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 49,
    nombre: "cebolla",
    precio: 3.30,
    imagen: "cebolla.png",
    description: "bolsa de 2.5 lb aproximadamente ",
    categoria: "Alimentos/Del Agro",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
 /* {
    id: 50,
    nombre: "Papas frescas",
    precio: 8.40,
    imagen: "papas.png",
    description: "Bolsa de 5 lb frescas",
    categoria: "Alimentos/Del Agro",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13],
    descuento: 55,
  },
 {
    id: 51,
    nombre: "Col",
    precio: 1.70,
    imagen: "col.svg",
    description: "bolsa con 1 unidad sellada",
    categoria: "Alimentos/Del Agro"
  },
  {
    id: 52,
    nombre: "Boniato",
    precio: 2.40,
    imagen: "boniato.svg",
    description: "bolsa de 5 lb",
    categoria: "Alimentos/Del Agro"
  },*/
  // Del Hogar
  {
    id: 53,
    nombre: "Frazada de limpiar suelo",
    precio: 2.4,
    imagen: "frazada.png",
    description: "2 unidad",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 116,
    nombre: "Detergente Liquido Lavaloza",
    precio: 2.60,
    imagen: "lavaloza.png",
    description: "Pomo de 500 ml",
    categoria: "Del Hogar",
    reciente: 1,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
    {
    id: 117,
    nombre: "Detergente Liquido STB",
    precio: 3.20,
    imagen: "stbliquido.png",
    description: "Bolsa de 1 L",
    categoria: "Del Hogar",
    reciente: 1,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },

  {
    id: 55,
    nombre: "Detergente polvo Multiuso",
    precio: 2.6,
    imagen: "detergente.png",
    description: "bolsa de 1 Kg ",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 56,
    nombre: "Jabon De Olor",
    precio: 1.2,
    imagen: "jabon.png",
    description: "por unidades",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ],
    descuento : 30, 
  },
  {
    id: 57,
    nombre: "Papel Higienico",
    precio: 2.2,
    imagen: "papel.png",
    description: "bolsa con 4 unidad sellada",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 58,
    nombre: "Perlas de olor para ropa",
    precio: 3.5,
    imagen: "perlas.png",
    description: "frasco de 200 gr",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 59,
    nombre: "Suavizante para ropa",
    precio: 6,
    imagen: "suavizante.png",
    description: "Pomo de 1 lt",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 60,
    nombre: "Toallitas humedas multiuso premiun",
    precio: 3.8,
    imagen: "toallas.png",
    description: "Paquete de 120 udst",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 61,
    nombre: "Pastillas de inodoro",
    precio: 2.40,
    imagen: "pastillas.png",
    description: "4 uds",
    categoria: "Del Hogar",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  // De Electrodomésticos
  {
    id: 62,
    nombre: "Ventilador de pedestal",
    precio: 60,
    imagen: "ventilador.png",
    description: "Ventilador tipo ciclón Milexus",
    categoria: "De Electrodomésticos",
    descuento : 5,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 94,
    nombre: "Cajas de tv Hd",
    precio: 65,
    imagen: "cajita.png",
    description: "Caja descodificadora Hd",
    categoria: "De Electrodomésticos",
    descuento : 5,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 95,
    nombre: "Olla reina Milexus ",
    precio: 100,
    imagen: "reina.png",
    description: "Olla reina de 6L Milexus",
    categoria: "De Electrodomésticos",
    descuento : 20,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 96,
    nombre: "Olla Arrocera ",
    precio: 60 ,
    imagen: "arrocera.png",
    description: "Olla arrocera de 1,8 l Milexus",
    categoria: "De Electrodomésticos",
    descuento : 18,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 97,
    nombre: "Freidora de aire  ",
    precio: 100 ,
    imagen: "freidora.png",
    description: "Olla freidora de aire de 4 l ",
    categoria: "De Electrodomésticos",
    descuento : 10,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 114,
    nombre: "Fogon de 3 quemadores  ",
    precio: 75,
    imagen: "fogon.png",
    description: "Fogon milexus de 3 quemadores ",
    categoria: "De Electrodomésticos",
    descuento : 15,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 98,
    nombre: "Ventilador de pared ",
    precio: 75,
    imagen: "ventiladorpared.png",
    description: "Ventilador de 18 pulgadas de pared ",
    categoria: "De Electrodomésticos",
    descuento : 15,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 99,
    nombre: "Fogon Infrarrojo   ",
    precio: 100,
    imagen: "fogoninfra.png",
    description: "Fogon Infrarrojo 2200 W    ",
    categoria: "De Electrodomésticos",
    descuento : 20,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 103,
    nombre: "Microwave Premier 20 Litro    ",
    precio: 160,
    imagen: "microwave.png",
    description: "Microwave Premier 20 Litro    ",
    categoria: "De Electrodomésticos",
    descuento : 12,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 104,
    nombre: "Lavadora automática 8 L   ",
    precio: 400,
    imagen: "automatica.png",
    description: "Lavadora automatica 8 L    ",
    categoria: "De Electrodomésticos",
    descuento : 12,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 105,
    nombre: "Lavadora semiautomática 7 L   ",
    precio: 300,
    imagen: "semiautomatica7.png",
    description: "Lavadora semiautomatica 7 L    ",
    categoria: "De Electrodomésticos",
    descuento : 13,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 106,
    nombre: "Lavadora semiautomática 9 L   ",
    precio: 320,
    imagen: "semiautomatica7.png",
    description: "Lavadora semiautomatica 7 L    ",
    categoria: "De Electrodomésticos",
    descuento : 12,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  
  {
    id: 63,
    nombre: "Split milexus",
    precio: 380,
    imagen: "split.png",
    description: "Milexus 1200 btu",
    categoria: "De Electrodomésticos",
    descuento : 7,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 64,
    nombre: "Frezeer",
    precio: 350,
    imagen: "nevera.png",
    description: "Milexus 6 pies",
    categoria: "De Electrodomésticos",
    descuento : 5,     
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 65,
    nombre: "Tv de 32",
    precio: 260,
    imagen: "32.png",
    description: "Tv inteligente 32 pulgadas",
    categoria: "De Electrodomésticos",
    descuento : 7,
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  /*{
    id: 66,
    nombre: "Tv de 55",
    precio: 450,
    imagen: "55.png",
    description: "Tv inteligente Milexus 55 pulgadas",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },*/
  {
    id: 67,
    nombre: "Batidora Milexus",
    precio: 45,
    imagen: "batidora.png",
    descuento : 5,
    description: "Batidora 2 en 1 (+ moledor de sazones)",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 68,
    nombre: "Cefetera Milexus",
    precio: 45,
    imagen: "cafetera.png",
    description: "Cafetera Electrica de 6 tazas",
    categoria: "De Electrodomésticos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  // Del Confi
  {
    id: 69,
    nombre: "Galletas María Baduco",
    precio: 1.25,
    imagen: "mariasbaduco.png",
    description: "Tubo de 170 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
   {
    id: 118,
    nombre: "Galletas Samyeli",
    precio: 0.90,
    imagen: "samyeli.png",
    description: "Tubo de 150 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
   {
    id: 119,
    nombre: "Donut Brawo de Caramelo",
    precio: 0.50,
    imagen: "donutbravo.png",
    description: "paquetico de 40 gr ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
   {
    id: 120,
    nombre: "Galletas Maxi 2000",
    precio: 2.60,
    imagen: "maxis2000.png",
    description: "paquete  de 500 gr ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
   {
    id: 121,
    nombre: "Bombom Truffle de Chocolate",
    precio: 8.60,
    imagen: "trufle.png",
    description: "Bolsa de 35 uds  ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
  {
    id: 122,
    nombre: "Galletas black out",
    precio: 2.20,
    imagen: "blackout.png",
    description: "Bolsa de 4 paquetes  ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
  {
    id: 123,
    nombre: "Papas Fritas Sabrosísimo",
    precio: 2.20,
    imagen: "papasfritas.png",
    description: "tubo de 140 gr  ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
  {
    id: 124,
    nombre: "Schoco cake",
    precio: 0.55,
    imagen: "schoco.png",
    description: "donut de 40 gr  ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
  {
    id: 128,
    nombre: "Galletas Kremali",
    precio: 1.11,
    imagen: "kremali.png",
    description: "paquete de 70 gr ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
   {
    id: 125,
    nombre: "Waffer de Vainilla, fresa y chocolate",
    precio: 1.50,
    imagen: "waferfresa.png",
    description: "paquete de 140 gr ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
   {
    id: 126,
    nombre: "Caja de sorbeticos  de Vainilla",
    precio: 7.50,
    imagen: "sorbetico.png",
    description: "Caja de 12 paquetes de 40  gr ",
    categoria: "Alimentos/Del Confi",
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
   {
    id: 110,
    nombre: "Galletas Snack Crackers",
    precio: 2.50,
    imagen: "snackcrackers.png",
    description: "Caja de 3 paquetes 189 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
  {
    id: 111,
    nombre: "Donas de Fresa 🍓 ",
    precio: 7.50,
    imagen: "donutfresa.png",
    description: "Caja de 24 unidades ",
    categoria: "Alimentos/Del Confi",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27],
    reciente: 1, // Marcar como reciente
    
  },
  {
    id: 70,
    nombre: "Bolita de chocolate",
    precio: 3.20,
    imagen: "bolitas.png",
    description: "bolsa de 500 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 71,
    nombre: "Best Chocolate",
    precio: 3.20,
    imagen: "conito.png",
    description: "Pomo de conitos 595 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 72,
    nombre: "Galletas Saltine Nezka",
    precio: 3.50,
    imagen: "saltine.png",
    description: "Cajita de 454 gr",
    categoria: "Alimentos/Del Confi",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 73,
    nombre: "Galletas Soda",
    precio: 3.20,
    imagen: "soda.png",
    description: "Paquete de 8 uds",
    categoria: "Alimentos/Del Confi",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ],
  },
 
]; 
// Combos temporales (justo después de la lista de productos existente)
const combosTemporales = [
  /*{
    id: 20012,
    nombre: "Combo Para Mamá 1",
    precio: 41.99,
    imagen: "combo1m.png",
    description: "Incluye 2 Bottelas de 1 L de aceite, 800 gr de Pasta de  Tomate, 5 spaguetis, 1 Garbanzo Goya, Bolsa de 5 lb de Frijol Negro,1 Mayonesa Celorio, Bolsa de 1 kg de Leche en Polvo, 2 Latas de Leche Condensada ",
    categoria: "Combos Temporales",
    reciente: 0,
    
    tiempoLimite: 72, // Horas de duración
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },
  {
    id: 30022,
    nombre: "Combo De Granos",
    precio: 16.50,
    imagen: "combo2.png",
    description: "Incluye 11 Lb de Arroz Brasileño, 3 Lb de Frijol Negro , 2 Lb de frijol Colorados ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [1,2,3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },*/
 {
    id: 20035,
    nombre: "Combo Fresa 🍓 ",
    precio: 18.50,
    imagen: "comboyogurt.png",
    description: "Incluye Caja de 24 donas de fresa, 1 cubeta de 4 L de yogurt probiótico de Fresa  ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27 ]
  },
 /*  {
    id: 20042,
    nombre: "Combo Para Mamá 3",
    precio: 21,
    imagen: "combo3m.png",
    description: "Incluye Galletas saladitas (6 paquetes), 6 Latas de jugo Multifrutas, 1 Lata de leche condensada, 6 Malta Morenas, 1 paquete de 50 Bombones.   ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 20052,
    nombre: "Combo Para Mamá 4",
    precio: 34.50,
    imagen: "combo4m.png",
    description: "Incluye 1 Paquete de pollo de 10 lb, 1 paquete de pechuga de 2 kg, 2 paquetes de salchichas, 2 paquetes de hamburguesas de 5 unidades.   ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },
  {
    id: 20062,
    nombre: "Combo Para Mamá 5",
    precio: 20,
    imagen: "combo5m.png",
    description: "Incluye 6 compotas, 6 latas de jugo multifrutas, 1 mantequilla de maní, 2 Tubos de galleta María, 3 Papitas Classic Mixtas.   ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },
  {
    id: 20072,
    nombre: "Combo Para Mamá 6",
    precio: 17.99,
    imagen: "combo6m.png",
    description: "Incluye 1 Pomo de Ajo triturado badia, 1 zumo de limón badia , 1 zumo de naranja badia, 2 botellas de aceite de 1 L, caja de 20 sazones Tropical.   ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },
  {
    id: 20082,
    nombre: "Combo Para Mamá 7",
    precio: 20.99,
    imagen: "combo7m.png",
    description: "Incluye 5 paquetes de spahgetti, 1 lata de 800 gr de pasta de tomate, 1 pomo de queso parmesano, 1 mayonesa celorio de 500 gr  ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },
  {
    id: 20092,
    nombre: "Combo Para Mamá 8",
    precio: 9.20,
    imagen: "combo8m.png",
    description: "Incluye 1 paquete de chicharos verde de 16 oz, 1 paquete de alubias de 16 oz, 1 paquete de frijol negro de 1 kg, 1 paquete de garbanzos de 16 oz, 1 bolsa de 1kg de frijol colorado  ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },
  {
    id: 20102,
    nombre: "Combo Para Mamá 9",
    precio: 13.99,
    imagen: "combo9m.png",
    description: "Incluye 1 paquete galletas marias (bolsa de 12 paqueticos, 6 Jugos de pera de 200 ml, 6 compotas, 3 papitas clasicc) ",
    categoria: "Combos Temporales",
    
    descuento: 0,
    tiempoLimite: 72,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
     ]
  },*/


];

// Agregar al final del array de productos (busca: const productos = [...])
productos.push(...combosTemporales);
// Función para renderizar combos temporales
function renderizarCombosTemporales() {
  const combosContainer = document.getElementById("combos-temporales-container");
  
  // Obtener municipio seleccionado
  const municipioSeleccionado = parseInt(localStorage.getItem('municipioSeleccionado'));
  
  // Filtrar combos por categoría Y municipio
  const combosFiltrados = productos.filter(p => 
    p.categoria === "Combos Temporales" && 
    p.municipios?.includes(municipioSeleccionado) // <-- ¡Filtro clave!
  );

  // Ocultar o mostrar sección de combos según si hay resultados
  const seccionCombos = document.getElementById("combos-temporales");
  if (!seccionCombos) return;

  if (combosFiltrados.length === 0) {
    seccionCombos.style.display = "none";
    return;
  } else {
    seccionCombos.style.display = "block";
  }

  // Renderizar combos
  const fragment = document.createDocumentFragment();

  combosFiltrados.forEach(combo => {
    const div = document.createElement("div");
    div.className = "producto combo-temporal";
    div.dataset.id = combo.id;

    // Cálculo del precio con o sin descuento
    const tieneDescuento = combo.descuento && combo.descuento > 0;
    const precioConDescuento = tieneDescuento
      ? (combo.precio * (1 - combo.descuento / 100)).toFixed(2)
      : combo.precio.toFixed(2);

    // Temporizador por combo
    let fechaLimite;
    const storageKey = `combo_tiempo_${combo.id}`;
    const fechaGuardada = localStorage.getItem(storageKey);

    if (fechaGuardada) {
      fechaLimite = new Date(parseInt(fechaGuardada));
    } else {
      fechaLimite = new Date();
      fechaLimite.setHours(fechaLimite.getHours() + combo.tiempoLimite);
      localStorage.setItem(storageKey, fechaLimite.getTime());
    }

    // Estructura HTML del combo
    div.innerHTML = `
      <div class="img-container">
        <img src="images/${combo.imagen}" alt="${combo.nombre}" loading="lazy">
        ${tieneDescuento ? `<div class="discount-label">-${combo.descuento}%</div>` : ""}
        <div class="time-label">⏳ Oferta limitada</div>
      </div>
      <div class="etiqueta-categoria Combos-Temporales">${combo.categoria}</div>
      <h3>${combo.nombre}</h3>
      ${tieneDescuento ? `<p class="precio-original">USD ${combo.precio.toFixed(2)}</p>` : ""}
      <p class="precio-nuevo">USD ${precioConDescuento}</p>
      <div class="combo-timer" data-fechalimite="${fechaLimite.getTime()}">
        <p>Tiempo restante:</p>
        <div class="timer">
          <span class="days">00</span>d : 
          <span class="hours">00</span>h : 
          <span class="minutes">00</span>m : 
          <span class="seconds">00</span>s
        </div>
      </div>
      <button data-id="${combo.id}" class="btn-agregar">Agregar al carrito</button>
    `;

    fragment.appendChild(div);
  });

  combosContainer.innerHTML = "";
  combosContainer.appendChild(fragment);

  iniciarContadoresTemporales();
}

// Función para activar los temporizadores de los combos
function iniciarContadoresTemporales() {
  document.querySelectorAll('.combo-timer').forEach(timer => {
    const fechaLimite = parseInt(timer.dataset.fechalimite);
    const intervalo = setInterval(() => {
      const ahora = new Date().getTime();
      const tiempoRestante = fechaLimite - ahora;

      if (tiempoRestante <= 0) {
        clearInterval(intervalo);
        const boton = timer.closest('.combo-temporal')?.querySelector('.btn-agregar');
        if (boton) boton.disabled = true;
        timer.innerHTML = `<p style="color:red; font-weight:bold;">⏳ Tiempo agotado</p>`;
        return;
      }

      const dias = Math.floor(tiempoRestante / (1000 * 60 * 60 * 24));
      const horas = Math.floor((tiempoRestante % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((tiempoRestante % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((tiempoRestante % (1000 * 60)) / 1000);

      timer.querySelector('.days').textContent = dias.toString().padStart(2, '0');
      timer.querySelector('.hours').textContent = horas.toString().padStart(2, '0');
      timer.querySelector('.minutes').textContent = minutos.toString().padStart(2, '0');
      timer.querySelector('.seconds').textContent = segundos.toString().padStart(2, '0');
    }, 1000);
  });
}



// Variables globales y caching de elementos
let carrito = [];
const productosContainer = document.getElementById("productos-container");
const contadorCarritoElem = document.getElementById("contador-carrito");

// Función que retorna el total en USD (sin conversión)
function calcularTotalUSD() {
  return carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
}

/**
 * RENDERIZAR PRODUCTOS
 * - Muestra el nombre, la categoría y la imagen.
 * - Si tiene descuento, se muestra el precio original TACHADO y el precio nuevo.
 * - Filtra por municipio seleccionado
 */
function renderizarProductos(categoria = "todas") {
  if (!productosContainer) return;
  
  const municipioSeleccionado = localStorage.getItem('municipioSeleccionado');
  const fragment = document.createDocumentFragment();
  
  let filtrados = categoria === "todas" 
    ? productos 
    : productos.filter(p => p.categoria === categoria);
  
  // Filtrar por municipio si hay uno seleccionado
  if (municipioSeleccionado) {
    filtrados = filtrados.filter(p => 
      p.municipios && p.municipios.includes(parseInt(municipioSeleccionado)))
  }
  
  filtrados.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.id = `producto-${prod.id}`;
    div.dataset.id = prod.id;
    div.dataset.categoria = prod.categoria;
    const categoriaSinBarra = prod.categoria.replace(/[^a-zA-Z0-9]/g, '-');

    if (prod.categoria === "Servicios") {
      div.innerHTML = `
        <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
        <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
        <h3>${prod.nombre}</h3>
        <a href="https://wa.me/5353933247?text=${encodeURIComponent("Me interesa una cotización para " + prod.nombre)}" 
           target="_blank" class="btn-cotizacion">Cotización del Servicio</a>
      `;
    } else {
      if (prod.descuento && prod.descuento > 0) {
        const descuento = prod.descuento;
        const precioOriginal = prod.precio;
        const precioNuevo = precioOriginal * (1 - descuento / 100);
        div.innerHTML = `
          <div class="img-container">
              <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
              <div class="discount-label">Descuento ${descuento}%</div>
          </div>
          <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
          <h3>${prod.nombre}</h3>
          <p class="precio-original">USD ${precioOriginal.toFixed(2)}</p>
          <p class="precio-nuevo">USD ${precioNuevo.toFixed(2)}</p>
          <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
        `;
      } else {
        div.innerHTML = `
          <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
          <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
          <h3>${prod.nombre}</h3>
          <p class="precio-nuevo">USD ${prod.precio.toFixed(2)}</p>
          <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
        `;
      }
    }
    fragment.appendChild(div);
  });
  productosContainer.innerHTML = "";
  productosContainer.appendChild(fragment);
}

// Renderiza la sección de ofertas con filtro por municipio
function renderizarOfertas() {
  const ofertasContainer = document.querySelector(".ofertas-container");
  if (!ofertasContainer) return;
  
  const municipioSeleccionado = localStorage.getItem('municipioSeleccionado');
  let ofertas = productos.filter(p => p.descuento && p.descuento > 0);
  
  // Filtrar por municipio si hay uno seleccionado
  if (municipioSeleccionado) {
    ofertas = ofertas.filter(p => 
      p.municipios && p.municipios.includes(parseInt(municipioSeleccionado)))
  }
  
  const fragment = document.createDocumentFragment();

  ofertas.forEach(prod => {
    const div = document.createElement("div");
    div.className = "producto";
    div.dataset.id = prod.id;
    const descuento = prod.descuento;
    const precioOriginal = prod.precio;
    const precioNuevo = precioOriginal * (1 - descuento / 100);
    const categoriaSinBarra = prod.categoria.replace(/[^a-zA-Z0-9]/g, '-');

    div.innerHTML = `
      <div class="img-container">
          <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
          <div class="discount-label">Descuento ${descuento}%</div>
      </div>
      <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
      <h3>${prod.nombre}</h3>
      <p class="precio-original">USD ${precioOriginal.toFixed(2)}</p>
      <p class="precio-nuevo">USD ${precioNuevo.toFixed(2)}</p>
      <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
    `;
    fragment.appendChild(div);
  });
  ofertasContainer.innerHTML = "";
  ofertasContainer.appendChild(fragment);
}

// Renderiza productos recientes con filtro por municipio
function renderizarProductosRecientes() {
  const productosRecientesContainer = document.querySelector(
    "#productos-recientes .productos-recientes-container"
  );
  if (!productosRecientesContainer) return;

  const municipioSeleccionado = localStorage.getItem('municipioSeleccionado');
  let productosRecientes = productos.filter((p) => p.reciente === 1);
  
  // Filtrar por municipio si hay uno seleccionado
  if (municipioSeleccionado) {
    productosRecientes = productosRecientes.filter(p => 
      p.municipios && p.municipios.includes(parseInt(municipioSeleccionado)))
  }
  
  const fragment = document.createDocumentFragment();

  productosRecientes.forEach((prod) => {
    const div = document.createElement("div");
    div.className = "producto";
    div.dataset.id = prod.id;
    const categoriaSinBarra = prod.categoria.replace(/[^a-zA-Z0-9]/g, "-");

    div.innerHTML = `
      <div class="img-container">
        <img src="images/${prod.imagen}" alt="${prod.nombre}" loading="lazy">
      </div>
      <div class="etiqueta-categoria ${categoriaSinBarra}">${prod.categoria}</div>
      <h3>${prod.nombre}</h3>
      <p class="precio">USD ${prod.precio.toFixed(2)}</p>
      <button data-id="${prod.id}" class="btn-agregar">Agregar al carrito</button>
    `;
    fragment.appendChild(div);
  });
  productosRecientesContainer.innerHTML = "";
  productosRecientesContainer.appendChild(fragment);
}

// Agrega producto al carrito
function agregarAlCarrito(id) {
  const producto = productos.find(p => p.id === id);
  if (!producto) return;
  let precioCarrito = producto.precio;
  if (producto.descuento && producto.descuento > 0) {
    precioCarrito = producto.precio * (1 - producto.descuento / 100);
  }
  const enCarrito = carrito.find(p => p.id === id);
  if (enCarrito) {
    enCarrito.cantidad++;
  } else {
    carrito.push({ ...producto, precio: precioCarrito, cantidad: 1 });
  }
  mostrarMensaje(`¡${producto.nombre} agregado al carrito!`);
  actualizarContadorCarrito();
  guardarCarritoEnLocalStorage();
}

// Muestra mensaje emergente
function mostrarMensaje(msg) {
  const mensajeElem = document.createElement("div");
  mensajeElem.className = "mensaje-carrito";
  mensajeElem.textContent = msg;
  document.body.appendChild(mensajeElem);
  setTimeout(() => mensajeElem.remove(), 2000);
}

// Actualiza el contador del carrito
function actualizarContadorCarrito() {
  const total = carrito.reduce((acc, prod) => acc + prod.cantidad, 0);
  if (contadorCarritoElem) contadorCarritoElem.textContent = total;
}

// Guarda y carga el carrito desde localStorage
function guardarCarritoEnLocalStorage() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
  const guardado = localStorage.getItem("carrito");
  if (guardado) {
    carrito = JSON.parse(guardado) || [];
    actualizarContadorCarrito();
  }
}

function renderizarCarrito() {
  const itemsCarrito = document.getElementById("items-carrito");
  const totalElem = document.getElementById("total-pedido");
  
  if (!itemsCarrito) return;

  itemsCarrito.innerHTML = "";
  
  if (carrito.length === 0) {
    itemsCarrito.innerHTML = `
      <div class="carrito-vacio">
        <i class="fas fa-shopping-cart"></i>
        <p>Tu carrito está vacío</p>
        <a href="index.html" class="btn-seguir-comprando">Seguir comprando</a>
      </div>
    `;
    if (totalElem) totalElem.textContent = "USD 0.00";
    return;
  }

  const fragment = document.createDocumentFragment();
  
  carrito.forEach(prod => {
    const div = document.createElement("div");
    div.className = "item-carrito";
    div.innerHTML = `
      <img src="images/${prod.imagen}" alt="${prod.nombre}" onerror="this.src='images/placeholder.png'">
      <div class="item-info">
        <h4>${prod.nombre}</h4>
        <p>USD ${prod.precio.toFixed(2)} x ${prod.cantidad}</p>
        <p class="subtotal">Subtotal: USD ${(prod.precio * prod.cantidad).toFixed(2)}</p>
      </div>
      <div class="contador-cantidad">
        <button class="btn-cambiar" data-id="${prod.id}" data-delta="-1">-</button>
        <span class="cantidad">${prod.cantidad}</span>
        <button class="btn-cambiar" data-id="${prod.id}" data-delta="1">+</button>
      </div>
      <button class="eliminar-item" data-id="${prod.id}">
        <i class="fas fa-trash"></i>
      </button>
    `;
    fragment.appendChild(div);
  });

  itemsCarrito.appendChild(fragment);
  
  // Calcular total según método de pago
  const metodoPago = document.getElementById("metodo-pago")?.value || "USD";
  const totalUSD = carrito.reduce((acc, prod) => acc + (prod.precio * prod.cantidad), 0);
  
  if (totalElem) {
    if (metodoPago.includes("CUP")) {
      totalElem.textContent = `CUP ${(totalUSD * tasaCambio).toFixed(2)}`;
    } else {
      totalElem.textContent = `USD ${totalUSD.toFixed(2)}`;
    }
  }
}

// Cambia la cantidad de un producto en el carrito
function cambiarCantidad(id, delta) {
  const prod = carrito.find(p => p.id === id);
  if (!prod) return;
  prod.cantidad += delta;
  if (prod.cantidad <= 0) {
    carrito = carrito.filter(p => p.id !== id);
  }
  guardarCarritoEnLocalStorage();
  renderizarCarrito();
  actualizarContadorCarrito();
}

// Elimina un producto del carrito
function eliminarDelCarrito(id) {
  carrito = carrito.filter(p => p.id !== id);
  guardarCarritoEnLocalStorage();
  renderizarCarrito();
  actualizarContadorCarrito();
}

// Redirige a index.html
function redirigirAPaginaPrincipal() {
  window.location.href = "index.html";
}

function validarFormulario() {
  const nombreComprador = document.getElementById("nombre-comprador").value;
  const emailComprador = document.getElementById("email-comprador").value;
  const telefonoComprador = document.getElementById("telefono-comprador").value;
  const direccionEntrega = document.getElementById("direccion-entrega").value;

  if (!nombreComprador || !emailComprador || !telefonoComprador || !direccionEntrega) {
    alert("Por favor, complete todos los campos obligatorios.");
    return false;
  }

  // Validación del número de teléfono (WhatsApp)
  if (!/^\d{8,10}$/.test(telefonoComprador)) {
    alert("El número de teléfono no es válido. Debe tener 8 o 9 o 10 dígitos.");
    return false;
  }

  // Validación del correo electrónico (opcional)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(emailComprador)) {
    alert("El correo electrónico no es válido.");
    return false;
  }

  return true;
}

// Envía el pedido por WhatsApp y vacía el carrito con el formato solicitado
function enviarPedidoPorWhatsapp() {
  if (!validarFormulario()) {
    return; // Detener si la validación falla
  }

  const nombreComprador = document.getElementById("nombre-comprador").value;
  const emailComprador = document.getElementById("email-comprador").value;
  const telefonoComprador = document.getElementById("telefono-comprador").value;
  const direccionEntrega = document.getElementById("direccion-entrega").value;
  const nota = document.getElementById("nota").value;
  const nombreBeneficiario = document.getElementById("nombre-beneficiario").value;
  const telefonoBeneficiario = document.getElementById("telefono-beneficiario").value;
  const metodoPago = document.getElementById("metodo-pago").value;
  const totalUSD = calcularTotalUSD();

  let totalMensaje;
  let moneda;
  if (metodoPago.indexOf("CUP") !== -1) {
    totalMensaje = totalUSD * tasaCambio;
    moneda = "CUP";
  } else {
    totalMensaje = totalUSD;
    moneda = "USD";
  }
  const totalTexto = totalMensaje.toFixed(2) + " " + moneda;

  let mensaje = `Nuevo Pedido\n\n`;
  mensaje += `Datos del Comprador:\n\n`;
  mensaje += `• Nombre: ${nombreComprador}\n`;
  mensaje += `• Email: ${emailComprador}\n`;
  mensaje += `• Teléfono: ${telefonoComprador}\n\n`;

  if (nombreBeneficiario && telefonoBeneficiario) {
    mensaje += `Datos del Beneficiario:\n\n`;
    mensaje += `• Nombre: ${nombreBeneficiario}\n`;
    mensaje += `• Teléfono: ${telefonoBeneficiario}\n\n`;
  }

  mensaje += `Información de Envío:\n\n`;
  mensaje += `• Dirección: ${direccionEntrega}\n`;
  if (nota) {
    mensaje += `• Nota: ${nota}\n`;
  }
  mensaje += `• Método de Pago: ${metodoPago}\n\n`;

  // Incluir el vendedor si existe
  const vendedor = localStorage.getItem("vendedor");
  if (vendedor) {
    mensaje += `Vendedor: ${vendedor}\n\n`;
  }

  mensaje += `Información de Pago:\n`;
  mensaje += `Total a pagar: ${totalTexto}\n`;
  mensaje += `Por favor en minutos recibirá la cuenta a transferir realice la transferencia y envíe el comprobante por este medio.\n\n`;
  mensaje += `Productos:\n\n`;
  carrito.forEach(prod => {
    let productTotal = prod.cantidad * prod.precio;
    if (moneda === "CUP") {
      productTotal *= tasaCambio;
    }
    mensaje += `• ${prod.cantidad}x ${prod.nombre} - ${productTotal.toFixed(2)} ${moneda}\n`;
  });
  mensaje += `\nTotal a Pagar: ${totalTexto} de 24 a 48 horas pedido completado, Siempre trataremos q sea en el día`;

  try {
    const mensajeCodificado = encodeURIComponent(mensaje);
    const urlWhatsapp = `https://wa.me/+5354642589?text=${mensajeCodificado}`;
    window.open(urlWhatsapp, "_blank");
    alert("¡Pedido enviado correctamente! Gracias por su compra.");
    cerrarModalPedido();
    vaciarCarrito();
    limpiarFormulario();
  } catch (error) {
    console.error("Error al enviar el pedido:", error);
    alert("Hubo un error al procesar su pedido. Por favor, intente de nuevo.");
  }
}

function limpiarFormulario() {
  document.getElementById("nombre-comprador").value = "";
  document.getElementById("email-comprador").value = "";
  document.getElementById("telefono-comprador").value = "";
  document.getElementById("direccion-entrega").value = "";
  document.getElementById("nombre-beneficiario").value = "";
  document.getElementById("telefono-beneficiario").value = "";
  if (document.getElementById("nota")) {
    document.getElementById("nota").value = "";
  }
}

// Vacía el carrito y actualiza la interfaz y el localStorage
function vaciarCarrito() {
  carrito = [];
  guardarCarritoEnLocalStorage();
  actualizarContadorCarrito();
  if (document.getElementById("items-carrito")) {
    renderizarCarrito();
  }
}

// Cierra el modal de pedido
function cerrarModalPedido() {
  const modal = document.getElementById("modal-pedido");
  if (modal) modal.style.display = "none";
}

// Modal para mostrar descripción del producto
function mostrarDescripcionProducto(producto) {
  const modal = document.getElementById("modal-descripcion");
  if (!modal) return;

  const modalImagen = modal.querySelector("#modal-imagen");
  const modalNombre = modal.querySelector(".modal-nombre");
  const modalDescripcion = modal.querySelector(".modal-descripcion");
  const botonAgregar = modal.querySelector("#btn-add-modal");

  modalImagen.src = `images/${producto.imagen}`;
  modalImagen.alt = producto.nombre;
  modalNombre.textContent = producto.nombre;
  modalDescripcion.textContent = producto.description;

  botonAgregar.dataset.id = producto.id;

  modal.style.display = "block";
}
document.addEventListener("DOMContentLoaded", () => {
  const botonAgregar = document.getElementById("btn-add-modal");
  if (botonAgregar) {
    botonAgregar.addEventListener("click", () => {
      const id = parseInt(botonAgregar.dataset.id, 10);
      agregarAlCarrito(id);

      // Cerrar modal después de añadir
      const modal = document.getElementById("modal-descripcion");
      if (modal) modal.style.display = "none";
    });
  }
});

// Event delegation
document.addEventListener("click", (e) => {
  if (e.target.matches(".btn-agregar")) {
    const id = parseInt(e.target.dataset.id, 10);
    agregarAlCarrito(id);
    return;
  }
  const productoDiv = e.target.closest(".producto");
  if (productoDiv) {
    const prodId = parseInt(productoDiv.dataset.id, 10);
    const producto = productos.find((p) => p.id === prodId);
    if (producto) {
      mostrarDescripcionProducto(producto);
    }
  }
  if (e.target.matches(".btn-cambiar")) {
    const id = parseInt(e.target.dataset.id, 10);
    const delta = parseInt(e.target.dataset.delta, 10);
    cambiarCantidad(id, delta);
  }
  if (e.target.matches(".eliminar-item")) {
    const id = parseInt(e.target.dataset.id, 10);
    eliminarDelCarrito(id);
  }
  if (e.target.matches("#seguir-comprando")) {
    redirigirAPaginaPrincipal();
  }
  if (e.target.matches(".cerrar-modal")) {
    cerrarModalPedido();
  }
});

const modalDescripcionClose = document.querySelector("#modal-descripcion .close");
if (modalDescripcionClose) {
  modalDescripcionClose.addEventListener("click", () => {
    const modal = document.getElementById("modal-descripcion");
    if (modal) modal.style.display = "none";
  });
}

window.addEventListener("click", (e) => {
  const modal = document.getElementById("modal-descripcion");
  if (modal && e.target === modal) {
    modal.style.display = "none";
  }
});

function actualizarTotalSegunMetodo() {
  renderizarCarrito();
}

window.addEventListener("click", (e) => {
  const modalPedido = document.getElementById("modal-pedido");
  if (modalPedido && e.target === modalPedido) {
    cerrarModalPedido();
  }
});

function sharePage() {
  if (navigator.share) {
    navigator.share({
      title: document.title,
      url: window.location.href
    })
    .then(() => console.log("Página compartida exitosamente"))
    .catch((error) => console.error("Error al compartir:", error));
  } else {
    alert("La función de compartir no es soportada en este navegador.");
  }
}

// Inicialización al cargar la página
document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("DOMContentLoaded", () => {
  const botonAgregar = document.getElementById("btn-add-modal");
  if (botonAgregar) {
    botonAgregar.addEventListener("click", () => {
      const id = parseInt(botonAgregar.dataset.id, 10);
      agregarAlCarrito(id);

      // Cierra el modal
      const modal = document.getElementById("modal-descripcion");
      if (modal) modal.style.display = "none";
    });
  }
});

  // Mostrar los modales de ubicación en cada carga de página
  mostrarModalProvincias();
  // Capturar el vendedor desde la URL y guardarlo
  capturarVendedor();

  cargarCarritoDesdeLocalStorage();
  if (productosContainer) {
    renderizarProductos();
    const filtros = document.querySelectorAll(".filtro-btn");
    filtros.forEach(btn => {
      btn.addEventListener("click", () => {
        filtros.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        renderizarProductos(btn.dataset.categoria);
      });
    });
    renderizarOfertas();
  }
  if (document.getElementById("items-carrito")) {
    renderizarCarrito();
    const btnWhatsapp = document.getElementById("pedir-whatsapp");
    if (btnWhatsapp) {
      btnWhatsapp.addEventListener("click", (e) => {
        e.preventDefault();
        document.getElementById("modal-pedido").style.display = "block";
      });
    }
    const formularioPedido = document.getElementById("formulario-pedido");
    if (formularioPedido) {
      formularioPedido.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validarFormulario()) {
          enviarPedidoPorWhatsapp();
        }
      });
    }
    const metodoSelect = document.getElementById("metodo-pago");
    if (metodoSelect) {
      metodoSelect.addEventListener("change", actualizarTotalSegunMetodo);
    }
  }
  const telefonoInput = document.getElementById("telefono");
  if (telefonoInput) {
    telefonoInput.addEventListener("input", () => {
      if (!/^\d*$/.test(telefonoInput.value)) {
        telefonoInput.setCustomValidity("Solo se permiten números.");
      } else {
        telefonoInput.setCustomValidity("");
      }
    });
  }
});


// Inicializar las secciones
let currentSlide = 0;
const slides = document.querySelectorAll(".banner-slide");
const dots = document.querySelectorAll(".dot");

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    dots[i].classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
      dots[i].classList.add("active");
    }
  });
}

function changeSlide(step) {
  currentSlide = (currentSlide + step + slides.length) % slides.length;
  showSlide(currentSlide);
}

function goToSlide(index) {
  currentSlide = index;
  showSlide(currentSlide);
}

setInterval(() => {
  changeSlide(1);
}, 10000);
function toggleMenu() {
  const nav = document.getElementById("main-nav");
  nav.classList.toggle("active");
}

// Inicializar
showSlide(currentSlide);

renderizarCombosTemporales(); 
renderizarOfertas();
renderizarProductosRecientes();
document.addEventListener('DOMContentLoaded', () => {
  // Verifica si ya hay un municipio guardado en el localStorage.
  const municipioGuardado = localStorage.getItem('municipioSeleccionado');
  
  // Verifica si la página actual es la del carrito (por ejemplo, "cart.html")
  const isCartPage = window.location.pathname.includes('cart.html');
  
  
  // Si no se encontró un municipio seleccionado y NO estamos en la página del carrito, se muestra el modal.
  if (!municipioGuardado && !isCartPage) {
    mostrarModalProvincias();
  }
});
document.querySelector(".close-button").addEventListener("click", () => {
  document.querySelector(".product-details-container").classList.remove("show");
});
const url = new URL(window.location.href);
const hash = url.hash;

if (hash.startsWith("#producto-")) {
  const id = parseInt(hash.replace("#producto-", ""));
  const producto = productos.find((p) => p.id === id);
  if (producto) {
    setTimeout(() => mostrarDescripcionProducto(producto), 500); // espera que cargue
  }
}
