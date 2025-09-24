// Definir el stock inicial de productos con unidades vendidas
let stockProductos = [
  { id: 1, name: "Completo", stock: 100, unidadesVendidas: 0 },
  { id: 2, name: "Empanada Queso", stock: 50, unidadesVendidas: 0 },
  { id: 3, name: "Empanada Pino Horno", stock: 100, unidadesVendidas: 0 },
  { id: 4, name: "Empanada Pino Frita", stock: 50, unidadesVendidas: 0 },
  { id: 5, name: "Anticucho", stock: 50, unidadesVendidas: 0 },
  { id: 6, name: "Choripan", stock: 50, unidadesVendidas: 0 },
  { id: 7, name: "Salchipapa", stock: 50, unidadesVendidas: 0 },
  { id: 8, name: "Papas Fritas", stock: 50, unidadesVendidas: 0 },
  { id: 9, name: "Brazo de Reina", stock: 5, unidadesVendidas: 0 },
  { id: 10, name: "Pan de Pascua", stock: 5, unidadesVendidas: 0 },
  { id: 11, name: "Queque", stock: 40, unidadesVendidas: 0 },
  { id: 12, name: "Pie de Limón", stock: 12, unidadesVendidas: 0 },
  { id: 13, name: "Coca-cola 1.25 lt", stock: 10, unidadesVendidas: 0 },
  { id: 14, name: "Coca-cola Zero 1.25 lt", stock: 15, unidadesVendidas: 0 },
  { id: 15, name: "Sprite 1.25 lt", stock: 10, unidadesVendidas: 0 },
  { id: 16, name: "Fanta 1.25 lt", stock: 8, unidadesVendidas: 0 },
  { id: 17, name: "Coca-cola Zero Express", stock: 72, unidadesVendidas: 0 },
  { id: 18, name: "Sprite Express", stock: 24, unidadesVendidas: 0 },
  { id: 19, name: "Fanta Express", stock: 24, unidadesVendidas: 0 },
  
];

// Función para llenar la tabla de stock
function llenarTablaStock() {
  const tablaStock = document.getElementById('tablaStock').getElementsByTagName('tbody')[0];
  
  // Limpiar la tabla antes de llenarla
  tablaStock.innerHTML = '';

  stockProductos.forEach(producto => {
    const row = document.createElement('tr');
    
    const cellProducto = document.createElement('td');
    const cellStockInicial = document.createElement('td');
    const cellUnidadesVendidas = document.createElement('td');
    const cellStockActual = document.createElement('td');
    
    cellProducto.textContent = producto.name;
    cellStockInicial.textContent = producto.stock;
    cellUnidadesVendidas.textContent = producto.unidadesVendidas;
    cellStockActual.textContent = producto.stock - producto.unidadesVendidas; // Calcular el stock actual

    row.appendChild(cellProducto);
    row.appendChild(cellStockInicial);
    row.appendChild(cellUnidadesVendidas);
    row.appendChild(cellStockActual);

    tablaStock.appendChild(row);
  });
}

// Función para actualizar las unidades vendidas cuando se complete una venta
function actualizarUnidadesVendidas(idProducto, cantidad) {
  // Buscar el producto en el array
  const producto = stockProductos.find(p => p.id === idProducto);
  
  if (producto) {
    producto.unidadesVendidas += cantidad; // Sumar las unidades vendidas
    // Guardar el stock actualizado en localStorage
    localStorage.setItem('stockProductos', JSON.stringify(stockProductos)); // Guardamos el stock actualizado
    llenarTablaStock(); // Actualizamos la tabla después de la venta
  } else {
    console.log("Producto no encontrado.");
  }
}

// Recuperar el stock desde localStorage al cargar la página
function recuperarStockDesdeLocalStorage() {
  const stockGuardado = JSON.parse(localStorage.getItem('stockProductos'));
  if (stockGuardado) {
    stockProductos = stockGuardado; // Si existe, cargar el stock guardado en localStorage
  }
}

// Llamar a la función para llenar la tabla al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  recuperarStockDesdeLocalStorage(); // Recuperar el stock guardado en localStorage
  llenarTablaStock(); // Llenar la tabla con los datos recuperados
});

// Simulación de agregar un producto al carrito
function agregarProductoAlCarrito(idProducto, cantidad) {
  // Lógica para agregar el producto al carrito (omitiendo el código del carrito por ahora)
  
  // Ahora actualizamos las unidades vendidas
  actualizarUnidadesVendidas(idProducto, cantidad); // Actualizar el stock y unidades vendidas
}
