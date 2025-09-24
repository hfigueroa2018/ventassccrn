// Definir el stock inicial de productos con unidades vendidas
const stockProductos = [
  { id: 1, name: "Completo", stock: 50, unidadesVendidas: 0 },
  { id: 2, name: "Emp. Napolitana", stock: 100, unidadesVendidas: 0 },
  { id: 3, name: "Anticucho", stock: 30, unidadesVendidas: 0 },
  { id: 13, name: "Coca-cola 1.25 lt", stock: 150, unidadesVendidas: 0 },
  { id: 20, name: "Cafe", stock: 200, unidadesVendidas: 0 }
];


// Función para llenar la tabla de stock
function llenarTablaStock() {
  const tablaStock = document.getElementById('tablaStock').getElementsByTagName('tbody')[0];
  stockProductos.forEach(producto => {
    const row = document.createElement('tr');
    const cellProducto = document.createElement('td');
    const cellStockInicial = document.createElement('td');
    const cellUnidadesVendidas = document.createElement('td');
    const cellStockActual = document.createElement('td');

    cellProducto.textContent = producto.name;
    cellStockInicial.textContent = producto.stock;
    cellUnidadesVendidas.textContent = producto.unidadesVendidas;
    cellStockActual.textContent = producto.stock - producto.unidadesVendidas;  // Calculamos el stock actual

    row.appendChild(cellProducto);
    row.appendChild(cellStockInicial);
    row.appendChild(cellUnidadesVendidas);
    row.appendChild(cellStockActual);
    tablaStock.appendChild(row);
  });
}

// Llamar a la función para llenar la tabla al cargar la página
document.addEventListener('DOMContentLoaded', llenarTablaStock);

// Función para actualizar las unidades vendidas cuando se complete una venta
function actualizarUnidadesVendidas(productoId, cantidad) {
  stockProductos[productoId].unidadesVendidas += cantidad;
  llenarTablaStock(); // Actualizamos la tabla después de la venta
}

// Función para actualizar las unidades vendidas
function actualizarUnidadesVendidas(idProducto, cantidad) {
  // Buscar el producto en el array
  const producto = stockProductos.find(p => p.id === idProducto);
  
  if (producto) {
    producto.unidadesVendidas += cantidad; // Sumar las unidades vendidas
    llenarTablaStock(); // Volver a renderizar la tabla con los nuevos valores
  } else {
    console.log("Producto no encontrado.");
  }
}

// Función para llenar la tabla de stock
function llenarTablaStock() {
  const tablaStock = document.getElementById('tablaStock').getElementsByTagName('tbody')[0];
  
  // Limpiar la tabla antes de llenarla
  tablaStock.innerHTML = '';

  stockProductos.forEach(producto => {
    const row = document.createElement('tr');
    
    // Crear celdas para el producto, stock inicial, unidades vendidas y stock actual
    const cellProducto = document.createElement('td');
    const cellStockInicial = document.createElement('td');
    const cellUnidadesVendidas = document.createElement('td');
    const cellStockActual = document.createElement('td');
    
    cellProducto.textContent = producto.name;
    cellStockInicial.textContent = producto.stock;
    cellUnidadesVendidas.textContent = producto.unidadesVendidas;
    cellStockActual.textContent = producto.stock - producto.unidadesVendidas; // Calcular el stock actual

    // Añadir las celdas a la fila
    row.appendChild(cellProducto);
    row.appendChild(cellStockInicial);
    row.appendChild(cellUnidadesVendidas);
    row.appendChild(cellStockActual);

    // Añadir la fila a la tabla
    tablaStock.appendChild(row);
  });
}


// Simulación de agregar un producto al carrito
function agregarProductoAlCarrito(idProducto, cantidad) {
  // Lógica para agregar el producto al carrito (omitiendo el código del carrito por ahora)
  
  // Ahora actualizamos las unidades vendidas
  actualizarUnidadesVendidas(idProducto, cantidad); // Actualizar el stock y unidades vendidas
}

