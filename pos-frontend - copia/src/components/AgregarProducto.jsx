import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AgregarProducto = () => {
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    min_stock: '',
    max_stock: '',
    capacity: '',
    pack_quantity: '',
    category_id: '',
    brand_id: '',
    container_id: ''
  });

  const [categorias, setCategorias] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [envases, setEnvases] = useState([]);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    // Encapsular la lógica async dentro de una función
    const fetchData = async () => {
      try {
        const [catRes, brandRes, contRes] = await Promise.all([
          axios.get('http://localhost:5000/api/categories'),
          axios.get('http://localhost:5000/api/brands'),
          axios.get('http://localhost:5000/api/containers')
        ]);

        setCategorias(catRes.data);
        setMarcas(brandRes.data);
        setEnvases(contRes.data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };

    fetchData(); // Llamada a la función async
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    try {
      await axios.post('http://localhost:5000/api/products', {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock),
        min_stock: parseInt(form.min_stock),
        max_stock: parseInt(form.max_stock),
        pack_quantity: form.pack_quantity ? parseInt(form.pack_quantity) : null,
        brand_id: form.brand_id || null,
        container_id: form.container_id || null
      });

      setMensaje('Producto agregado exitosamente');
      setForm({
        name: '',
        price: '',
        stock: '',
        min_stock: '',
        max_stock: '',
        capacity: '',
        pack_quantity: '',
        category_id: '',
        brand_id: '',
        container_id: ''
      });
    } catch (err) {
      console.error('Error al agregar producto:', err);
      setMensaje('Error al agregar producto');
    }
  };

  return (
    <div>
      <h2>Agregar Producto</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Precio"
          required
        />
        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />
        <input
          type="number"
          name="min_stock"
          value={form.min_stock}
          onChange={handleChange}
          placeholder="Stock Mínimo"
          required
        />
        <input
          type="number"
          name="max_stock"
          value={form.max_stock}
          onChange={handleChange}
          placeholder="Stock Máximo"
          required
        />
        <input
          type="text"
          name="capacity"
          value={form.capacity}
          onChange={handleChange}
          placeholder="Capacidad (ej. 355ml)"
        />
        

        <label>Categoría:</label>
        <select
          name="category_id"
          value={form.category_id}
          onChange={handleChange}
          required
        >
          <option value="">Seleccione Categoría</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        <label>Marca:</label>
        <select name="brand_id" value={form.brand_id} onChange={handleChange}>
          <option value="">Seleccione Marca</option>
          {marcas.map(brand => (
            <option key={brand.id} value={brand.id}>
              {brand.name}
            </option>
          ))}
        </select>

        <label>Envase:</label>
        <select
          name="container_id"
          value={form.container_id}
          onChange={handleChange}
        >
          <option value="">Seleccione Tipo de Envase</option>
          {envases.map(env => (
            <option key={env.id} value={env.id}>
              {env.type}
            </option>
          ))}
        </select>

        <button type="submit">Agregar Producto</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default AgregarProducto;


//<input
          //type="number"
          //name="pack_quantity"
          //value={form.pack_quantity}
          //onChange={handleChange}
          //placeholder="Cantidad por paquete"
        //>