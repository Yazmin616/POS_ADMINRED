import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Inventario.css';

const Inventario = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [envases, setEnvases] = useState([]);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);

  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [stock, setStock] = useState('');
  const [stockMin, setStockMin] = useState('');
  const [stockMax, setStockMax] = useState('');
  const [categoria, setCategoria] = useState('');
  const [marca, setMarca] = useState('');
  const [envase, setEnvase] = useState('');
  const [capacidad, setCapacidad] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchData = async () => {
      try {
        const [prodRes, catRes, brandRes, contRes] = await Promise.all([
          axios.get('http://localhost:5000/api/products', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/categories', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/brands', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:5000/api/containers', { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setProductos(prodRes.data);
        setCategorias(catRes.data);
        setMarcas(brandRes.data);
        setEnvases(contRes.data);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };

    fetchData();
  }, []);

  const handleEditProduct = (producto) => {
    setSelectedProduct(producto);
    setOriginalProduct(producto);
    setNombre(producto.name);
    setPrecio(producto.price);
    setStock(producto.stock);
    setStockMin(producto.min_stock);
    setStockMax(producto.max_stock);
    setCategoria(producto.category_id);
    setMarca(producto.brand_id);
    setEnvase(producto.container_id);
    setCapacidad(producto.capacity);
  };

const handleUpdateProduct = async () => {
  if (!selectedProduct) return;

  const updatedFields = {};
  if (nombre !== originalProduct.name) updatedFields.name = nombre;
  if (Number(precio) !== originalProduct.price) updatedFields.price = Number(precio);
  if (Number(stock) !== originalProduct.stock) updatedFields.stock = Number(stock);
  if (Number(stockMin) !== originalProduct.min_stock) updatedFields.min_stock = Number(stockMin);
  if (Number(stockMax) !== originalProduct.max_stock) updatedFields.max_stock = Number(stockMax);
  if (Number(categoria) !== originalProduct.category_id) updatedFields.category_id = Number(categoria);
  if (Number(marca) !== originalProduct.brand_id) updatedFields.brand_id = Number(marca);
  if (Number(envase) !== originalProduct.container_id) updatedFields.container_id = Number(envase);
  if (capacidad !== originalProduct.capacity) updatedFields.capacity = capacidad;

  if (Object.keys(updatedFields).length === 0) {
    alert('No hay cambios para actualizar');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const res = await axios.put(
      `http://localhost:5000/api/products/${selectedProduct.id}`,
      updatedFields,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    alert('Producto actualizado');

    setProductos((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...res.data,
              brand_name: p.brand_name,
              container_type: p.container_type,
              category_name: p.category_name,
            }
          : p
      )
    );

    setSelectedProduct(null);
    setOriginalProduct(null);
    setNombre('');
    setPrecio('');
    setStock('');
    setStockMin('');
    setStockMax('');
    setCategoria('');
    setMarca('');
    setEnvase('');
    setCapacidad('');
  } catch (err) {
    console.error('Error al actualizar producto:', err);
    alert('Error al actualizar producto');
  }
};


  return (
    <div className="inventario-container">
      <h2>Inventario</h2>

      {selectedProduct && (
        <div className="form-edit">
          <h3>Editar Producto</h3>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del Producto"
          />
          <input
            type="number"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            placeholder="Precio"
          />
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            placeholder="Existencias"
          />
          <input
            type="number"
            value={stockMin}
            onChange={(e) => setStockMin(e.target.value)}
            placeholder="Stock Mínimo"
          />
          <input
            type="number"
            value={stockMax}
            onChange={(e) => setStockMax(e.target.value)}
            placeholder="Stock Máximo"
          />
          <input
            type="text"
            value={capacidad}
            onChange={(e) => setCapacidad(e.target.value)}
            placeholder="Capacidad (ml o L)"
          />

          <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
            <option value="">Selecciona una categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select value={marca} onChange={(e) => setMarca(e.target.value)}>
            <option value="">Selecciona una marca</option>
            {marcas.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>

          <select value={envase} onChange={(e) => setEnvase(e.target.value)}>
            <option value="">Selecciona un tipo de envase</option>
            {envases.map((e) => (
              <option key={e.id} value={e.id}>{e.type}</option>
            ))}
          </select>

          <button onClick={handleUpdateProduct}>Actualizar Producto</button>
          <button onClick={() => setSelectedProduct(null)}>Cancelar</button>
        </div>
      )}

      <h3>Lista de Productos</h3>
      <table className="productos-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Marca</th>
            <th>Envase</th>
            <th>Capacidad</th>
            <th>Precio</th>
            <th>Existencias</th>
            <th>Stock Mínimo</th>
            <th>Stock Máximo</th>
            <th>Categoría</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => (
            <tr key={producto.id}>
              <td>{producto.name}</td>
              <td>{producto.brand_name}</td>
              <td>{producto.container_type}</td>
              <td>{producto.capacity}</td>
              <td>${producto.price}</td>
              <td>{producto.stock}</td>
              <td>{producto.min_stock}</td>
              <td>{producto.max_stock}</td>
              <td>{producto.category_name}</td>
              <td>
                <button onClick={() => handleEditProduct(producto)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Inventario;
