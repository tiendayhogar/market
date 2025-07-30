"use strict";
// Forzar visualización completa en móviles
function setMobileViewport() {
  if (window.innerWidth <= 768) {
    const viewport = document.querySelector('meta[name="viewport"]');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
    
    // Ajustar altura inicial
    document.documentElement.style.height = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'auto';
    
    // Ajustar para iOS
    window.addEventListener('orientationchange', function() {
      setTimeout(function() {
        window.scrollTo(0, 0);
      }, 100);
    });
  }
}
// Evitar que el teclado distorsione la vista
window.addEventListener('resize', function() {
  if (window.innerWidth <= 768) {
    const activeElement = document.activeElement;
    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
      setTimeout(function() {
        activeElement.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 300);
    }
  }
});

// Llamar al cargar y al cambiar tamaño
document.addEventListener('DOMContentLoaded', setMobileViewport);
window.addEventListener('resize', setMobileViewport);
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
// Funciones para la búsqueda
function toggleResultadosContainer(mostrar) {
  const container = document.getElementById('resultados-busqueda-container');
  if (mostrar) {
    container.classList.remove('hidden');
  } else {
    container.classList.add('hidden');
  }
}

function scrollToResults() {
  const resultadosContainer = document.getElementById('resultados-busqueda-container');
  if (resultadosContainer) {
    resultadosContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function filtrarProductosPorNombre(textoBusqueda) {
  const textoMinuscula = textoBusqueda.toLowerCase();
  return productos.filter(producto =>
    producto.nombre.toLowerCase().includes(textoMinuscula)
  );
}

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
  
  // En la función mostrarModalUbicacion(), donde se configura btnConfirmar:
btnConfirmar.addEventListener('click', function() {
  const municipioSeleccionado = parseInt(selectMunicipio.value);
  if (!municipioSeleccionado) {
    alert('Por favor seleccione un municipio');
    return;
  }
  
  guardarUbicacion(ubicaciones.provinciaSeleccionada, municipioSeleccionado);
  // No necesitamos cerrar el modal aquí porque ya lo hace guardarUbicacion()
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
  
  // Cerrar y eliminar el modal
  const modal = document.getElementById('modal-ubicacion');
  if (modal) {
    modal.style.display = 'none';
    modal.remove(); // Eliminar el modal del DOM
  }
  
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
  renderizarCombosOferta();
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
  // ========== [CODIGO NUEVO - PEGA ESTO] ========== //
// Configurar menú de categorías
const categories = document.querySelectorAll('.category');
if (categories.length > 0) {
  categories.forEach(category => {
    category.addEventListener('click', () => {
      // Remover clase 'active' de todas las categorías
      categories.forEach(c => c.classList.remove('active'));
      // Añadir clase 'active' a la categoría clickeada
      category.classList.add('active');
      // Filtrar productos
      renderizarProductos(category.dataset.category);
    });
  });
  
  // Mostrar todos los productos al inicio
  renderizarProductos("todas");
}
// ========== [FIN DE CODIGO NUEVO] ========== //
  
  // Resto de tu inicialización...
  cargarCarritoDesdeLocalStorage();
  
  if (productosContainer) {
    renderizarProductos();
    // ... (código existente de filtros)
  }
  
  renderizarCombosOferta();
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
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

  },
  {
    id: 93,
    nombre: "Muslo de pollo ahumado ",
    precio: 12 ,
    imagen: "polloahumado.png",
    description: "Bolsa de 5 Lb ",
    categoria: "Alimentos/Cárnicos",
    reciente  : 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

  },*/

  {
    id: 5,
    nombre: "Masas de Cerdo",
    precio: 7.40,
    imagen: "masas.png",
    description: "Bandeja de masas de cerdo  sellada al vacio de 2 lb",
    categoria: "Alimentos/Cárnicos",
     reciente  : 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

  },
  {
    id: 6,
    nombre: "Bistec de cerdo",
    precio: 8.5,
    imagen: "bistec.png",
    description: "Bandeja de bistec sellada al vacio 2 lb",
    categoria: "Alimentos/Cárnicos",
     reciente  : 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]

  },
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
    description: "porcionado y sellado en 2.2 lb ",
    categoria: "Alimentos/Cárnicos",
    descuento:10,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    
  },
  {
    id: 10,
    nombre: "Lomo Ahumado",
    precio: 10.20,
    imagen: "ahumado1.png",
    description: "bandeja sellada al vacio de 1.2 lb lasqueado",
    categoria: "Alimentos/Cárnicos",
    reciente  : 1,
     municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
  },  */                                                                                                        
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
  {
    id: 12,
    nombre: "Humaré",
    precio: 1.4,
    imagen: "humaré.png",
    description: "Porcion sellada al vacio de tocino + costilla ahumada",
    categoria: "Alimentos/Cárnicos",
    reciente  : 1, 
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
  },
  {
    id: 134,
    nombre: "Mortadela de pollo Seara",
    precio: 2.30,
    imagen: "mortadela.png",
    description: "Tubo de 500 gr",
    categoria: "Alimentos/Cárnicos",
    reciente  : 1, 
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ,14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
  },
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
  {
    id: 131,
    nombre: "Salchichas GuiBon ",
    precio: 10.90,
    imagen: "60uds.png",
    description: "paquete de 60 unidades (3 Kg)",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 132,
    nombre: "Higado de Pollo ",
    precio: 3.40,
    imagen: "higado.png",
    description: "paquete de 1 Kg",
    categoria: "Alimentos/Cárnicos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 133,
    nombre: "pierna de Cerdo ",
    precio: 55,
    imagen: "pierna.png",
    description: "pierna entre 17 y 20 lb",
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
    categoria: "Enlatados y conservas",
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
    categoria: "Licoreria",
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
    categoria: "Licoreria",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  {
    id: 21,
    nombre: "Vino Espumoso",
    precio: 10,
    imagen: "espumoso.png",
    description: "botella de vino espumoso Varons d Valls 750 ml",
    categoria: "Licoreria",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, ]
  },
  {
    id: 22,
    nombre: "Ron Habana Club",
    precio: 7.70,
    imagen: "3años.png",
    description: "Añejo 3 años 750 ml",
    categoria: "Licoreria",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },*/
  {
    id: 23,
    nombre: "Malta Guajira",
    precio: 6.50,
    imagen: "guajira.png",
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
    precio: 5.9,
    imagen: "cafearoma.png",
    description: "Paquete de 250 gr",
    categoria: "Alimentos/Líquidos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 76,
    nombre: "Café Expreso ",
    precio: 5.6,
    imagen: "cafenezka.png",
    description: "Paquete de 250 gr",
    categoria: "Alimentos/Líquidos",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ],
    
  },
  {
    id: 130,
    nombre: "Café La Llave ",
    precio: 6.9,
    imagen: "lallave.png",
    description: "Paquete de 283 gr",
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
    categoria: "Aderezo y condimentos",
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
    categoria: "Enlatados y conservas",
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
    categoria: "Aderezo y condimentos",
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
    categoria: "Aderezo y condimentos",
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
    categoria: "Granos",
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
    categoria: "Granos",
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
    categoria: "Granos",
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
    categoria: "Granos",
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
  },*/
  {
    id: 87,
    nombre: "Botella de Aceite",
    precio: 3.20,
    imagen: "aceite.png",
    description: "Botella  de 1 L ",
    categoria: "Aderezo y condimentos",
    reciente: 1,
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 88,
    nombre: "Compota Babe",
    precio: 0.90,
    imagen: "compota.png",
    description: "Pomito de 4 Oz ",
    categoria: "Enlatados y conservas",
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
    categoria: "Aderezo y condimentos",
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
    categoria: "Aderezo y condimentos",
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
    categoria: "Aderezo y condimentos",
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
    categoria: "Enlatados y conservas",
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
    categoria: "Enlatados y conservas",
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
    categoria: "Enlatados y conservas",
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
    categoria: "Productos mixtos",
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
    categoria: "Enlatados y conservas",
    municipios: [ 4, 5, 6, 7, 8, 9, 10, 11,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ] 
  },
  /*{
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
  },*/
    {
    id: 109,
    nombre: "Pomo de Aceitunas",
    precio: 3.00,
    imagen: "aceituna290gr.png",
    description: "Pomo de 290 gr",
    categoria: "Enlatados y conservas",
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
    categoria: "Aderezo y condimentos",
   
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
    categoria: "Productos mixtos",
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
    categoria: "Productos mixtos",
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
    categoria: "Granos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
    },
  {
    id: 38,
    nombre: "Frijol Negro ",
    precio: 8,
    imagen: "frijol5lb.png",
    description: "bolsa de 5 Lb",
    categoria: "Granos",
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
    categoria: "Granos",
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
    categoria: "Granos",
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 41,
    nombre: "Sal Iodada ",
    precio: 1.20,
    imagen: "sal.png",
    description: "bolsa de 1 kg",
    categoria: "Granos",
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
    categoria: "Granos",
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
    categoria: "Productos mixtos",
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
    categoria: "Productos mixtos",
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
    categoria: "Aderezo y condimentos",
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
    categoria: "Productos mixtos",
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
    categoria: "Alimentos/Del Confi",
    
    municipios: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13,
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  /*{
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
  {
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
  {
    id:135 ,
    nombre: "Yogurt de Vasito De Fresa",
    precio: 2.65,
    imagen: "yoqo.png",
    description: "Pack de 4 Vasitos de 125 gr",
    categoria: "Alimentos/Lácteos",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
  {
    id: 43,
    nombre: "Queso Gouda Aleman",
    precio: 13.50,
    imagen: "gouda.png",
    description: "Porción de 1 Kg sellado al vacio",
    categoria: "Alimentos/Lácteos",
    municipios: [, 4, 5, 6, 7, 8, 9, 10, 11, 
      14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27
    ]
  },
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
    precio: 8.50,
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
    imagen: "detergente
