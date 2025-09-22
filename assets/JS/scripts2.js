/* COdigo 3 */

document.addEventListener('DOMContentLoaded', () => {
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

//Estas constantes son para el bloqueo del botón de generar ticket


  



    // Inicializar valores desde localStorage o establecer valores predeterminados
    let numeroTicket = parseInt(localStorage.getItem('numeroTicket')) || 1;
    let ventasEfectivo = parseFloat(localStorage.getItem('ventasEfectivo')) || 0;
    let ventasTransferencia = parseFloat(localStorage.getItem('ventasTransferencia')) || 0;
    let ventasTransbank = parseFloat(localStorage.getItem('ventasTransbank')) || 0;
    let historialVentas = JSON.parse(localStorage.getItem('historialVentas')) || [];

    // Mostrar valores iniciales en la interfaz
    numeroTicketEl.textContent = numeroTicket;
    ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
    ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
    ventasTransbankEl.textContent = ventasTransbank.toFixed(2);
    totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia + ventasTransbank).toFixed(2);

    // Cargar historial de ventas en la tabla
    function cargarHistorialVentas() {
        cuerpoHistorial.innerHTML = historialVentas.map(venta => `
            <tr class="${venta.anulado ? 'producto-anulado' : ''}">
                <td>${venta.numeroTicket}</td>
                <td>${venta.productos.join('<br>')}</td>
                <td>$${venta.montoTotal.toFixed(2)}</td>
                <td>${venta.medioPago}</td>
                <td>${venta.nombreCliente}</td>
                <td>${venta.estado}</td> <!-- Mostrar el estado -->
                <td>
                    ${venta.anulado ? 'Anulado' : `<img src="assets/IMG/eliminar.png" alt="Anular" class="btnAnular" data-ticket="${venta.numeroTicket}" style="cursor: pointer; width: 24px; height: 24px;">`}
                </td>
            </tr>
        `).join('');
    }

    cargarHistorialVentas();

    agregarProductoBtn.addEventListener('click', () => {
        const productoDiv = document.createElement('div');
        productoDiv.className = 'producto';
        productoDiv.innerHTML = `
            <select class="selectProducto">
                    <option value="1" data-precio="1800">Completo ($1800)</option>
                    <option value="2" data-precio="1200">Emp. Napolitana ($1200)</option>
                    <option value="3" data-precio="1200">Emp. Aceituna ($1200)</option>
                    <option value="4" data-precio="1200">Emp. Champiñon ($1200)</option>
                    <option value="5" data-precio="1200">Emp. Queso ($1200)</option>
                    <option value="6" data-precio="3000">Emp. Pino Horno ($3000)</option>
                    <option value="7" data-precio="2000">Emp. Pino Frita ($2000)</option>
                    <option value="8" data-precio="4000">Anticucho ($4000)</option>
                    <option value="9" data-precio="1500">Choripanes ($1500)</option>
                    <option value="10" data-precio="3000">Salchipapa ($3000)</option>
                    <option value="11" data-precio="2000">Papas Fritas ($2000)</option>
                    <option value="12" data-precio="2000">Pastel($2000)</option>
                    <option value="13" data-precio="3000">Coca-cola 1.25 lt($3000)</option>
                    <option value="14" data-precio="3000">Coca-cola Zero 1.25 lt($3000)</option>
                    <option value="15" data-precio="3000">Sprite 1.25 lt($3000)</option>
                    <option value="16" data-precio="3000">Fanta 1.25 lt($3000)</option>
                    <option value="17" data-precio="1000">Coca-cola Zero Express($1000)</option>
                    <option value="18" data-precio="1000">Sprite Express($1000)</option>
                    <option value="19" data-precio="1000">Fanta Express($1000)</option>
                    <option value="20" data-precio="500">Cafe ($500)</option>
                    <option value="21" data-precio="500">Te ($500)</option>
                    <option value="22" data-precio="200">Masticable Frutilla / Sandia ($200)</option>
                    <option value="23" data-precio="500">Kilombo ($500)</option>
                    <option value="24" data-precio="1000">Detodito ($1000)</option>
                    
            </select>

            <input type="number" class="inputCantidad" min="1" value="1">
            <span class="totalProducto">Total: $1500</span>
            <button type="button" class="btnEliminar">Eliminar</button>
        `;
        contenedorProductos.appendChild(productoDiv);
        actualizarTotal();
    });

    contenedorProductos.addEventListener('click', (e) => {
        if (e.target.classList.contains('btnEliminar')) {
            e.target.parentElement.remove();
            actualizarTotal();
        }
    });

    contenedorProductos.addEventListener('change', (e) => {
        if (e.target.classList.contains('selectProducto') || e.target.classList.contains('inputCantidad')) {
            actualizarTotal();
        }
    });

    function actualizarTotal() {
        let totalCompra = 0;
        document.querySelectorAll('.producto').forEach(producto => {
            const selectProducto = producto.querySelector('.selectProducto');
            const cantidad = producto.querySelector('.inputCantidad').value;
            const precio = selectProducto.options[selectProducto.selectedIndex].dataset.precio;
            const totalProducto = precio * cantidad;
            producto.querySelector('.totalProducto').textContent = `Total: $${totalProducto}`;
            totalCompra += totalProducto;
        });
        montoTotalEl.textContent = totalCompra.toFixed(2);
    }

    formularioTicket.addEventListener('submit', (e) => {
        e.preventDefault();

        // Preparar el contenido del ticket
        const productos = [];
        document.querySelectorAll('.producto').forEach(producto => {
            const selectProducto = producto.querySelector('.selectProducto');
            const cantidad = producto.querySelector('.inputCantidad').value;
            const nombreProducto = selectProducto.options[selectProducto.selectedIndex].text;
            productos.push(`${nombreProducto} - Cantidad: ${cantidad}`);
        });

        // Obtener el nombre del cliente
        const nombreCliente = document.getElementById('nombreCliente').value || 'Anónimo';

        // Determinar medio de pago
        const medioPago = document.getElementById('selectMedioPago').value;
        const montoTotal = parseFloat(montoTotalEl.textContent);

        // Obtener el estado seleccionado
        const estado = document.getElementById('selectestado').value;

        // Acumulación de ventas
        if (medioPago === 'efectivo') {
            ventasEfectivo += montoTotal;
        } else if (medioPago === 'transferencia') {
            ventasTransferencia += montoTotal;
        } else if (medioPago === 'transbank') {
            ventasTransbank += montoTotal;
        }

        // Guardar en localStorage
        localStorage.setItem('ventasEfectivo', ventasEfectivo.toFixed(2));
        localStorage.setItem('ventasTransferencia', ventasTransferencia.toFixed(2));
        localStorage.setItem('ventasTransbank', ventasTransbank.toFixed(2));
        localStorage.setItem('numeroTicket', numeroTicket + 1);

        // Actualizar desglose de ventas
        ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
        ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
        ventasTransbankEl.textContent = ventasTransbank.toFixed(2);
        totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia + ventasTransbank).toFixed(2);

        // Crear objeto para historial
        const nuevaVenta = {
            numeroTicket: numeroTicket,
            productos,
            montoTotal,
            medioPago,
            nombreCliente,
            estado, // Incluir el estado
            anulado: false
        };
        historialVentas.push(nuevaVenta);
        localStorage.setItem('historialVentas', JSON.stringify(historialVentas));

        // Preparar el contenido del ticket para impresión
        ticketImpreso.innerHTML = `
            <h3>Ticket N° ${numeroTicket}</h3>
            <p>Nombre del Cliente: ${nombreCliente}</p>
            <u>Detalle de la compra</u>
            <ul>
                ${productos.map(producto => `<li>${producto}</li>`).join('')}
            </ul>
            <p>Total: $${montoTotal.toFixed(2)}</p>
            <p>Medio de Pago: ${medioPago}</p>
            <p>Estado: ${estado}</p> <!-- Mostrar el estado en el ticket -->
        `;

        // Mostrar el ticket para impresión y ocultarlo después
        ticketImpreso.style.display = 'block';
        window.print();
        ticketImpreso.style.display = 'none';

        // Actualizar historial de ventas
        cargarHistorialVentas();

        // Incrementar número de ticket
        numeroTicket++;
        numeroTicketEl.textContent = numeroTicket;

        // Resetear el formulario
        formularioTicket.reset();
        contenedorProductos.innerHTML = '';
        montoTotalEl.textContent = '0';
    });

    // Función para anular una venta
    function anularVenta(numeroTicketAnular) {
        const ventaIndex = historialVentas.findIndex(venta => venta.numeroTicket === numeroTicketAnular);
        if (ventaIndex !== -1) {
            const venta = historialVentas[ventaIndex];
            if (!venta.anulado) {
                // Actualizar el desglose de ventas
                if (venta.medioPago === 'efectivo') {
                    ventasEfectivo -= venta.montoTotal;
                } else if (venta.medioPago === 'transferencia') {
                    ventasTransferencia -= venta.montoTotal;
                } else if (venta.medioPago === 'transbank') {
                    ventasTransbank -= venta.montoTotal;
                }

                // Guardar en localStorage
                localStorage.setItem('ventasEfectivo', ventasEfectivo.toFixed(2));
                localStorage.setItem('ventasTransferencia', ventasTransferencia.toFixed(2));
                localStorage.setItem('ventasTransbank', ventasTransbank.toFixed(2));

                // Marcar la venta como anulada
                venta.anulado = true;
                localStorage.setItem('historialVentas', JSON.stringify(historialVentas));

                // Actualizar desglose de ventas
                ventasEfectivoEl.textContent = ventasEfectivo.toFixed(2);
                ventasTransferenciaEl.textContent = ventasTransferencia.toFixed(2);
                ventasTransbankEl.textContent = ventasTransbank.toFixed(2);
                totalVentasEl.textContent = (ventasEfectivo + ventasTransferencia + ventasTransbank).toFixed(2);

                // Actualizar historial de ventas
                cargarHistorialVentas();
            }
        }
    }

    // Manejar eventos de anulación de venta
    cuerpoHistorial.addEventListener('click', (e) => {
        if (e.target.classList.contains('btnAnular')) {
            const numeroTicketAnular = parseInt(e.target.getAttribute('data-ticket'));
            if (confirm(`¿Está seguro de que desea anular el ticket ${numeroTicketAnular}?`)) {
                anularVenta(numeroTicketAnular);
            }
        }
    });

    // Función para exportar el historial de ventas a CSV
    function exportarHistorialVentas() {
        const encabezados = ['Ticket', 'Productos', 'Total', 'Medio de Pago', 'Nombre del Cliente', 'Estado','Anulado'];
        const filasCSV = [];

        // Agregar encabezados
        filasCSV.push(encabezados.join(','));

        // Agregar filas de datos desde historialVentas
        historialVentas.forEach(venta => {
            const estadoCSV = venta.estado === 'pagado'?'Pagado':'Pendiente';
            const fila = [
                venta.numeroTicket,
                venta.productos.join(' | '), // Productos separados por " | "
                venta.montoTotal.toFixed(2),
                venta.medioPago,
                venta.nombreCliente,
                estadoCSV,
                venta.anulado ? 'Si' : 'No' // Estado de la venta
            ];
            filasCSV.push(fila.join(','));
        });

        // Generar archivo CSV
        const cadenaCSV = filasCSV.join('\n');
        const blob = new Blob([cadenaCSV], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'historial_ventas.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Vincular el botón a la función de exportación
    document.getElementById('exportar-btn').addEventListener('click', exportarHistorialVentas);

//estro es para el navBar
    document.addEventListener('DOMContentLoaded', () => {
        const hamburger = document.querySelector('.hamburger');
        const navLinks = document.querySelector('.nav-links');
      
        // Toggle navbar on mobile
        hamburger.addEventListener('click', () => {
          navLinks.classList.toggle('show');
      
          // Animation for hamburger icon
          hamburger.classList.toggle('open');
        });
      
        // Close menu when a link is clicked
        navLinks.addEventListener('click', (e) => {
          if (e.target.tagName === 'A') {
            navLinks.classList.remove('show');
            hamburger.classList.remove('open');
          }
        });
      });

      
      

});






