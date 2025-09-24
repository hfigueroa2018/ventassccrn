/* scripts2.js - Versión modular y comentada */

/* ======= Catálogo de productos (fuente única) =======
   Mantén aquí tus productos para no tenerlos hardcodeados en múltiples lugares.
   Cada producto: { id, name, price, category (opcional) }
*/
const productsCatalog = [
  { id: 1, name: "Completo", price: 1500, category: "Comida" },
  { id: 2, name: "Emp. Queso", price: 1200, category: "Comida" },
  { id: 3, name: "Emp. Pino Horno", price: 3000, category: "Comida" },
  { id: 4, name: "Emp. Pino Frita", price: 2000, category: "Comida" },
  { id: 5, name: "Anticucho", price: 4000, category: "Comida" },
  { id: 6, name: "Choripanes", price: 1500, category: "Comida" },
  { id: 7, name: "Salchipapa", price: 3000, category: "Comida" },
  { id: 8, name: "Papas Fritas", price: 2000, category: "Comida" },
  { id: 9, name: "Brazo de reina", price: 2000, category: "Pasteleria" },
  { id: 10, name: "Pan de Pascua", price: 2000, category: "Pasteleria" },
  { id: 11, name: "Queque", price: 1000, category: "Comida" },
  { id: 12, name: "Pie de Limon", price: 3000, category: "Pasteleria" },
  { id: 13, name: "Coca-cola 1.25 lt", price: 3000, category: "Bebida" },
  { id: 14, name: "Coca-cola Zero 1.25 lt", price: 3000, category: "Bebida" },
  { id: 15, name: "Sprite 1.25 lt", price: 3000, category: "Bebida" },
  { id: 16, name: "Fanta 1.25 lt", price: 3000, category: "Bebida" },
  { id: 17, name: "Coca-cola Zero Express", price: 1000, category: "Bebida" },
  { id: 18, name: "Sprite Express", price: 1000, category: "Bebida" },
  { id: 19, name: "Fanta Express", price: 1000, category: "Bebida" },
  { id: 20, name: "Cafe", price: 500, category: "Bebida" },
  { id: 21, name: "Te", price: 500, category: "Bebida" },
  { id: 22, name: "Masticable Frutilla / Sandia", price: 200, category: "Dulce" },
  { id: 23, name: "Kilombo", price: 500, category: "Snack" },
  { id: 24, name: "Detodito", price: 1000, category: "Snack" }
];

/* ======= Utilidades ======= */
function formatMoney(n) {
  return Number(n).toFixed(2);
}

/* ======= Elementos del DOM ======= */
const contenedorProductos = document.getElementById('contenedorProductos');
const agregarProductoBtn = document.getElementById('agregarProducto');
const montoTotalEl = document.getElementById('montoTotal');
const numeroTicketEl = document.getElementById('numeroTicket');
const formularioTicket = document.getElementById('formularioTicket');
const ticketImpreso = document.getElementById('ticketImpreso');
const ventasEfectivoEl = document.getElementById('ventasEfectivo');
const ventasTransferenciaEl = document.getElementById('ventasTransferencia');
const ventasTransbankEl = document.getElementById('ventasTransbank');
const totalVentasEl = document.getElementById('totalVentas');
const cuerpoHistorial = document.getElementById('cuerpoHistorial');
const generarTicketBtn = document.getElementById('generarTicketBtn');
const nombreClienteInput = document.getElementById('nombreCliente');

/* ======= Estado (cargado desde localStorage si existe) ======= */
let numeroTicket = parseInt(localStorage.getItem('numeroTicket')) || 1;
let ventasEfectivo = parseFloat(localStorage.getItem('ventasEfectivo')) || 0;
let ventasTransferencia = parseFloat(localStorage.getItem('ventasTransferencia')) || 0;
let ventasTransbank = parseFloat(localStorage.getItem('ventasTransbank')) || 0;
let historialVentas = JSON.parse(localStorage.getItem('historialVentas')) || [];

/* ======= Inicializar UI con valores guardados ======= */
function inicializarUI() {
  numeroTicketEl.textContent = numeroTicket;
  ventasEfectivoEl.textContent = formatMoney(ventasEfectivo);
  ventasTransferenciaEl.textContent = formatMoney(ventasTransferencia);
  ventasTransbankEl.textContent = formatMoney(ventasTransbank);
  totalVentasEl.textContent = formatMoney(ventasEfectivo + ventasTransferencia + ventasTransbank);
  renderHistorial();
  validarFormulario(); // des/activar botón
}

/* ======= Render: fila de producto (DOM) ======= */
function crearProductoDOM() {
  const productoDiv = document.createElement('div');
  productoDiv.className = 'producto';
  // Crear select con opciones desde catálogo
  const select = document.createElement('select');
  select.className = 'selectProducto';
  productsCatalog.forEach(p => {
    const opt = document.createElement('option');
    opt.value = p.id;
    opt.dataset.precio = p.price;
    opt.textContent = `${p.name} ($${p.price})`;
    select.appendChild(opt);
  });

  const inputCantidad = document.createElement('input');
  inputCantidad.type = 'number';
  inputCantidad.className = 'inputCantidad';
  inputCantidad.min = 1;
  inputCantidad.value = 1;

  const spanTotal = document.createElement('span');
  spanTotal.className = 'totalProducto';
  // Inicializar total del primer producto
  const precioInicial = Number(select.options[select.selectedIndex].dataset.precio);
  spanTotal.textContent = `Total: $${formatMoney(precioInicial * Number(inputCantidad.value))}`;

  const btnEliminar = document.createElement('button');
  btnEliminar.type = 'button';
  btnEliminar.className = 'btnEliminar';
  btnEliminar.textContent = 'Eliminar';

  // Agregar elementos al contenedor
  productoDiv.appendChild(select);
  productoDiv.appendChild(inputCantidad);
  productoDiv.appendChild(spanTotal);
  productoDiv.appendChild(btnEliminar);

  return productoDiv;
}

/* ======= Acción: agregar producto ======= */
function agregarProducto() {
  const productoDom = crearProductoDOM();
  contenedorProductos.appendChild(productoDom);
  actualizarTotal();      // recalcula montos
  validarFormulario();    // habilita/deshabilita botón generar
}

/* ======= Escuchar clicks en contenedor (delegation) ======= */
contenedorProductos.addEventListener('click', (e) => {
  if (e.target.classList.contains('btnEliminar')) {
    e.target.parentElement.remove();
    actualizarTotal();
    validarFormulario();
  }
});

/* ======= Escuchar cambios en producto (select o cantidad) ======= */
contenedorProductos.addEventListener('change', (e) => {
  if (e.target.classList.contains('selectProducto') || e.target.classList.contains('inputCantidad')) {
    actualizarTotal();
    validarFormulario();
  }
});

/* ======= Calcular monto total de la compra y actualizar UI ======= */
function actualizarTotal() {
  let totalCompra = 0;
  const productosDOM = contenedorProductos.querySelectorAll('.producto');
  productosDOM.forEach(prod => {
    const select = prod.querySelector('.selectProducto');
    const cantidad = Number(prod.querySelector('.inputCantidad').value) || 0;
    const precio = Number(select.options[select.selectedIndex].dataset.precio) || 0;
    const subtotal = precio * cantidad;
    prod.querySelector('.totalProducto').textContent = `Total: $${formatMoney(subtotal)}`;
    totalCompra += subtotal;
  });
  montoTotalEl.textContent = formatMoney(totalCompra);
}

/* ======= Validación simple: habilitar botón GENERAR solo si hay productos y nombre ======= */
function validarFormulario() {
  const hayProductos = contenedorProductos.querySelectorAll('.producto').length > 0;
  const nombreValido = nombreClienteInput.value.trim() !== '';
  generarTicketBtn.disabled = !(hayProductos && nombreValido);
}

/* ======= Generar ticket (submit) ======= */
formularioTicket.addEventListener('submit', (e) => {
  e.preventDefault();
  generarTicket();
});



//Acá se genera el ticket
function generarTicket() {
  // Construir array de productos con detalle
  const productosVenta = [];
  const productosDOM = contenedorProductos.querySelectorAll('.producto');

  productosDOM.forEach(prod => {
    const id = Number(prod.querySelector('.selectProducto').value);
    const cantidad = Number(prod.querySelector('.inputCantidad').value) || 0;
    const productoCatalog = productsCatalog.find(p => p.id === id) || { name: 'Desconocido', price: 0, category: '-' };

    // Actualizar unidades vendidas en el stock
    actualizarUnidadesVendidas(id, cantidad);

    // Agregar producto a la venta (solo una vez por producto)
    productosVenta.push({
      id,
      name: productoCatalog.name,
      price: productoCatalog.price,
      quantity: cantidad,
      subtotal: productoCatalog.price * cantidad,
      category: productoCatalog.category || '-'
    });
  });

  const nombreCliente = nombreClienteInput.value.trim() || 'Anónimo';
  const medioPago = document.getElementById('selectMedioPago').value;
  const estado = document.getElementById('selectestado').value;
  const montoTotal = Number(montoTotalEl.textContent) || 0;

  // Actualizar acumuladores por medio de pago
  if (medioPago === 'efectivo') ventasEfectivo += montoTotal;
  else if (medioPago === 'transferencia') ventasTransferencia += montoTotal;
  else if (medioPago === 'transbank') ventasTransbank += montoTotal;

  // Guardar contadores en localStorage
  guardarContadoresEnLocalStorage();

  // Crear objeto venta
  const venta = {
    numeroTicket: numeroTicket, // ticket actual
    productos: productosVenta,
    montoTotal,
    medioPago,
    nombreCliente,
    estado,
    anulado: false,
    fecha: new Date().toISOString()
  };

  // Guardar en historial y persistir
  historialVentas.push(venta);
  localStorage.setItem('historialVentas', JSON.stringify(historialVentas));

  // Preparar contenido del ticket para impresión (simple)
  ticketImpreso.innerHTML = `
    <h3>Ticket N° ${venta.numeroTicket}</h3>
    <p>Nombre: ${venta.nombreCliente}</p>
    <p>Medio de pago: ${venta.medioPago} - Estado: ${venta.estado}</p>
    <u>Detalle</u>
    <ul>
      ${venta.productos.map(p => `<li>${p.name} x ${p.quantity} = $${formatMoney(p.subtotal)}</li>`).join('')}
    </ul>
    <p><strong>Total: $${formatMoney(venta.montoTotal)}</strong></p>
  `;

  // Mostrar + imprimir (en desarrollo puedes comentar window.print())
  ticketImpreso.style.display = 'block';
  window.print(); // Descomenta cuando quieras imprimir de verdad
  setTimeout(() => ticketImpreso.style.display = 'none', 500);

  // Incrementar número de ticket y persistir
  numeroTicket += 1;
  localStorage.setItem('numeroTicket', numeroTicket);
  numeroTicketEl.textContent = numeroTicket;

  // Actualizar UI y limpiar formulario
  renderHistorial();
  contenedorProductos.innerHTML = '';
  formularioTicket.reset();
  montoTotalEl.textContent = '0';
  validarFormulario();
}






/* ======= Guardar contadores en localStorage (números) ======= */
function guardarContadoresEnLocalStorage() {
  localStorage.setItem('ventasEfectivo', ventasEfectivo.toString());
  localStorage.setItem('ventasTransferencia', ventasTransferencia.toString());
  localStorage.setItem('ventasTransbank', ventasTransbank.toString());
  // total de ventas se calcula en UI
  ventasEfectivoEl.textContent = formatMoney(ventasEfectivo);
  ventasTransferenciaEl.textContent = formatMoney(ventasTransferencia);
  ventasTransbankEl.textContent = formatMoney(ventasTransbank);
  totalVentasEl.textContent = formatMoney(ventasEfectivo + ventasTransferencia + ventasTransbank);
}

/* ======= Renderizar historial en la tabla ======= */
// function renderHistorial() {
//   if (!Array.isArray(historialVentas)) historialVentas = [];
//   cuerpoHistorial.innerHTML = historialVentas.map(venta => {
//     const productosStr = venta.productos.map(p => `${p.name} x${p.quantity}`).join('<br>');
//     const categoria = venta.productos.length ? venta.productos[0].category || '-' : '-';
//     return `
//       <tr class="${venta.anulado ? 'producto-anulado' : ''}">
//         <td data-label="Número de Ticket">${venta.numeroTicket}</td>
//         <td data-label="Nombre del Cliente">${venta.nombreCliente}</td>
//         <td data-label="Productos">${productosStr}</td>
//         <td data-label="Categoría">${categoria}</td>
//         <td data-label="Medio de Pago">${venta.medioPago}</td>
//         <td data-label="Total">$${formatMoney(venta.montoTotal)}</td>
//         <td data-label="Estado">${venta.estado}</td>
//         <td data-label="Acciones">
//           ${venta.anulado ? 'Anulado' : `<button class="btnAnular" data-ticket="${venta.numeroTicket}" title="Anular">🗑️</button>`}
//         </td>
//       </tr>
//     `;
//   }).join('');
// }

function renderHistorial() {
  if (!Array.isArray(historialVentas)) historialVentas = [];
  cuerpoHistorial.innerHTML = '';

  historialVentas.forEach(venta => {
    venta.productos.forEach((producto, index) => {
      const row = document.createElement('tr');
      if (venta.anulado) row.classList.add('producto-anulado');

      // Solo en la primera fila del ticket mostramos ticket, cliente, total, medio pago, estado, acciones
      if (index === 0) {
        row.innerHTML = `
          <td rowspan="${venta.productos.length}" data-label="Número de Ticket">${venta.numeroTicket}</td>
          <td rowspan="${venta.productos.length}" data-label="Nombre del Cliente">${venta.nombreCliente}</td>
          <td data-label="Producto">${producto.name} x${producto.quantity}</td>
          <td data-label="Categoría">${producto.category}</td>
          <td rowspan="${venta.productos.length}" data-label="Medio de Pago">${venta.medioPago}</td>
          <td rowspan="${venta.productos.length}" data-label="Total">$${formatMoney(venta.montoTotal)}</td>
          <td rowspan="${venta.productos.length}" data-label="Estado">${venta.estado}</td>
      <td data-label="Acciones">
  ${venta.anulado ? 'Anulado' : `
    <button class="btnAccion editar" data-ticket="${venta.numeroTicket}" title="Editar">✏️</button>
    <button class="btnAccion anular" data-ticket="${venta.numeroTicket}" title="Anular">🗑️</button>
    

  `}
</td>


        `;
      } else {
        // Para las demás filas del mismo ticket solo mostramos producto y categoría
        row.innerHTML = `
          <td data-label="Producto">${producto.name} x${producto.quantity}</td>
          <td data-label="Categoría">${producto.category}</td>
        `;
      }

      cuerpoHistorial.appendChild(row);
    });
  });
}


/* ======= Anular venta (actualiza contadores y marca anulado) ======= */
function anularVenta(numeroTicketAnular) {
  const idx = historialVentas.findIndex(v => v.numeroTicket === numeroTicketAnular);
  if (idx === -1) return;
  const venta = historialVentas[idx];
  if (venta.anulado) return;

  // Restar del acumulado según medio de pago
  if (venta.medioPago === 'efectivo') ventasEfectivo -= venta.montoTotal;
  else if (venta.medioPago === 'transferencia') ventasTransferencia -= venta.montoTotal;
  else if (venta.medioPago === 'transbank') ventasTransbank -= venta.montoTotal;

  venta.anulado = true;
  localStorage.setItem('historialVentas', JSON.stringify(historialVentas));
  guardarContadoresEnLocalStorage();
  renderHistorial();
}

/* ======= Manejo evento anular desde la tabla (delegation) ======= */
cuerpoHistorial.addEventListener('click', (e) => {
  const btn = e.target.closest('.btnAccion.anular');
  if (!btn) return;
  const ticket = Number(btn.dataset.ticket);
  if (confirm(`¿Desea anular el ticket ${ticket}?`)) {
    anularVenta(ticket);
  }
});

/* ======= Exportar historial a CSV simple ======= */
function exportarHistorialCSV() {
  const headers = ['Ticket', 'Productos', 'Categoria', 'Total', 'MedioPago', 'NombreCliente', 'Estado', 'Anulado'];
  const filas = [headers.join(',')];

  historialVentas.forEach(v => {
    const productosStr = v.productos.map(p => `${p.name} x${p.quantity}`).join(' | ');
    const categoria = v.productos.length ? v.productos[0].category || '-' : '-';
    const fila = [
      v.numeroTicket,
      `"${productosStr}"`,
      `"${categoria}"`,
      formatMoney(v.montoTotal),
      v.medioPago,
      `"${v.nombreCliente}"`,
      v.estado,
      v.anulado ? 'Si' : 'No'
    ];
    filas.push(fila.join(','));
  });

  const blob = new Blob([filas.join('\n')], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'historial_ventas.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ======= Botón exportar (si existe en DOM) ======= */
const exportBtn = document.getElementById('exportar-btn');
if (exportBtn) exportBtn.addEventListener('click', exportarHistorialCSV);

/* ======= Escucha agregar producto ======= */
agregarProductoBtn.addEventListener('click', agregarProducto);

/* ======= Habilitar validación cuando se escribe el nombre ======= */
nombreClienteInput.addEventListener('input', validarFormulario);

/* ======= Inicialización cuando carga la página ======= */
document.addEventListener('DOMContentLoaded', () => {
  inicializarUI();

  // Si quieres durante desarrollo agregar un producto de ejemplo:
  // agregarProducto();
});

// Esto genera un pseudo modal, para modificar el medio de pago o el estado de pago
function abrirFormularioEdicion(venta) {
  // Crear contenedor flotante
  const editarDiv = document.createElement('div');
  editarDiv.className = 'editarTicketForm';
  editarDiv.style.position = 'absolute';
  editarDiv.style.background = '#fff';
  editarDiv.style.border = '1px solid #ccc';
  editarDiv.style.padding = '10px';
  editarDiv.style.zIndex = 1000;

  // Contenido del formulario
  editarDiv.innerHTML = `
    <h4>Editar Ticket N° ${venta.numeroTicket}</h4>
    <label>Medio de Pago:
      <select id="editarMedioPago">
        <option value="efectivo" ${venta.medioPago === 'efectivo' ? 'selected' : ''}>Efectivo</option>
        <option value="transferencia" ${venta.medioPago === 'transferencia' ? 'selected' : ''}>Transferencia</option>
        <option value="transbank" ${venta.medioPago === 'transbank' ? 'selected' : ''}>Transbank</option>
      </select>
    </label>
    <br>
    <label>Estado:
      <select id="editarEstado">
        <option value="pendiente" ${venta.estado === 'pendiente' ? 'selected' : ''}>Pendiente</option>
        <option value="pagado" ${venta.estado === 'pagado' ? 'selected' : ''}>Pagado</option>
      </select>
    </label>
    <br>
    <button id="guardarEdicion">Guardar</button>
    <button id="cancelarEdicion">Cancelar</button>
  `;

  document.body.appendChild(editarDiv);

  // Posicionar sobre el botón (opcional)
  const btn = document.querySelector(`.btnAccion.editar[data-ticket="${venta.numeroTicket}"]`);
  const rect = btn.getBoundingClientRect();
  editarDiv.style.top = `${rect.bottom + window.scrollY}px`;
  editarDiv.style.left = `${rect.left + window.scrollX}px`;

  // Guardar cambios
  editarDiv.querySelector('#guardarEdicion').addEventListener('click', () => {
    const nuevoMedio = editarDiv.querySelector('#editarMedioPago').value;
    const nuevoEstado = editarDiv.querySelector('#editarEstado').value;

    // Actualizar acumuladores si cambia medio de pago
    if (venta.medioPago !== nuevoMedio) {
      if (venta.medioPago === 'efectivo') ventasEfectivo -= venta.montoTotal;
      else if (venta.medioPago === 'transferencia') ventasTransferencia -= venta.montoTotal;
      else if (venta.medioPago === 'transbank') ventasTransbank -= venta.montoTotal;

      if (nuevoMedio === 'efectivo') ventasEfectivo += venta.montoTotal;
      else if (nuevoMedio === 'transferencia') ventasTransferencia += venta.montoTotal;
      else if (nuevoMedio === 'transbank') ventasTransbank += venta.montoTotal;

      venta.medioPago = nuevoMedio;
      guardarContadoresEnLocalStorage();
    }

    // Actualizar estado
    venta.estado = nuevoEstado;

    // Guardar historial y cerrar formulario
    localStorage.setItem('historialVentas', JSON.stringify(historialVentas));
    editarDiv.remove();
    renderHistorial();
  });

  // Cancelar
  editarDiv.querySelector('#cancelarEdicion').addEventListener('click', () => {
    editarDiv.remove();
  });
}


cuerpoHistorial.addEventListener('click', (e) => {
  const btn = e.target.closest('.btnAccion.editar');
  if (!btn) return;
  const ticketNum = Number(btn.dataset.ticket);
  const venta = historialVentas.find(v => v.numeroTicket === ticketNum);
  if (!venta) return;

  abrirFormularioEdicion(venta);
});


