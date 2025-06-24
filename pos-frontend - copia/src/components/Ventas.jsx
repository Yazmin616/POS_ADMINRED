import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Ventas() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState('');
  const [cantidad, setCantidad] = useState(1);
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState({
    nombre: '',
    telefono: '',
    direccion: '',
    correo: ''
  });

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener productos', error);
        alert('Error al cargar los productos');
      }
    };

    obtenerProductos();
  }, []);

  const calcularTotal = () => {
    const subtotal = carrito.reduce((acc, item) => acc + item.subtotal, 0);
    const iva = subtotal * 0.16;
    const total = subtotal + iva;
    return { subtotal, iva, total };
  };

  const { subtotal, iva, total } = calcularTotal();

  const agregarAlCarrito = () => {
    const producto = productos.find(p => p.id === parseInt(productoSeleccionado));
    if (!producto) {
      alert('Selecciona un producto válido');
      return;
    }

    if (producto.stock < cantidad) {
      alert(`No hay suficiente stock de ${producto.name}. Solo quedan ${producto.stock} unidades.`);
      return;
    }

    const categoria = producto.category ? producto.category.name : 'Sin categoría';

    const nuevoItem = {
      id: producto.id,
      name: producto.name,
      categoria,
      cantidad,
      precio: producto.price,
      subtotal: producto.price * cantidad
    };

    setCarrito([...carrito, nuevoItem]);
    setCantidad(1);
    setProductoSeleccionado('');
  };

  const confirmarVenta = async () => {
    if (carrito.length === 0) {
      alert('Carrito vacío');
      return;
    }

    if (!cliente.nombre || !cliente.telefono || !cliente.direccion || !cliente.correo) {
      alert('Por favor completa todos los datos del cliente incluyendo correo');
      return;
    }

    const token = localStorage.getItem('token');
    const user_id = parseInt(localStorage.getItem('user_id'));

    try {
      await axios.post('http://localhost:5000/api/sales', {
        carrito,
        total: subtotal,
        iva,
        total_with_iva: total,
        user_id,
        cliente
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert('Venta registrada con éxito');
      setCarrito([]);
      setCliente({ nombre: '', telefono: '', direccion: '', correo: '' });

    } catch (err) {
      const error = err.response?.data;
      if (error?.detalles) {
        alert(`Error en validación:\n- ${error.detalles.join('\n- ')}`);
      } else {
        alert('Error al registrar la venta');
      }
    }
  };

  const cancelarCompra = () => {
    if (window.confirm('¿Estás seguro de que deseas cancelar la compra? Todo el carrito se perderá.')) {
      setCarrito([]);
      setProductoSeleccionado('');
      setCantidad(1);
      setCliente({ nombre: '', telefono: '', direccion: '', correo: '' });
    }
  };

  return (
    <div>
      <h2>Formulario de Ventas</h2>

      <h3>Datos del Cliente</h3>
      <input 
        type="text" 
        placeholder="Nombre del cliente" 
        value={cliente.nombre} 
        onChange={(e) => setCliente({ ...cliente, nombre: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="Teléfono del cliente" 
        value={cliente.telefono} 
        onChange={(e) => setCliente({ ...cliente, telefono: e.target.value })} 
      />
      <input 
        type="text" 
        placeholder="Dirección del cliente" 
        value={cliente.direccion} 
        onChange={(e) => setCliente({ ...cliente, direccion: e.target.value })} 
      />
      <input 
        type="email" 
        placeholder="Correo del cliente" 
        value={cliente.correo} 
        onChange={(e) => setCliente({ ...cliente, correo: e.target.value })} 
      />

      <h3>Agregar productos al carrito</h3>
      <select value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)}>
        <option value="">-- Seleccione un producto --</option>
        {productos.map(p => (
          <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
        ))}
      </select>
      <input 
        type="number" 
        min="1" 
        value={cantidad} 
        onChange={(e) => setCantidad(parseInt(e.target.value) || 1)} 
      />
      <button onClick={agregarAlCarrito}>Agregar al carrito</button>

      <h3>Carrito</h3>
      <ul>
        {carrito.map((item, idx) => (
          <li key={idx}>{item.name} x {item.cantidad} = ${item.subtotal.toFixed(2)}</li>
        ))}
      </ul>

      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>IVA (16%): ${iva.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>

      <button onClick={confirmarVenta}>Confirmar Venta</button>
      <button onClick={cancelarCompra}>Cancelar Compra</button>
    </div>
  );
}

export default Ventas;
