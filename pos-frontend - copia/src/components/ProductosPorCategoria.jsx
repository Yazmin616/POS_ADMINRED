import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProductosPorCategoria = ({ categoriaId }) => {
  const [marcas, setMarcas] = useState([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
  const [productos, setProductos] = useState([]);

  // Cargar marcas al cambiar la categoría seleccionada
  useEffect(() => {
    const fetchMarcas = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/brands/by-category/${categoriaId}`);
        setMarcas(res.data);
        setMarcaSeleccionada(null);
        setProductos([]);
      } catch (err) {
        console.error('Error al cargar marcas:', err);
      }
    };
    if (categoriaId) {
      fetchMarcas();
    }
  }, [categoriaId]);

  // Cargar productos cuando seleccionamos una marca
  useEffect(() => {
    const fetchProductos = async () => {
      if (!marcaSeleccionada) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/products/by-category-brand?categoryId=${categoriaId}&brandId=${marcaSeleccionada}`
        );
        setProductos(res.data);
      } catch (err) {
        console.error('Error al cargar productos:', err);
      }
    };
    fetchProductos();
  }, [categoriaId, marcaSeleccionada]);

  return (
    <div>
      <h3>Marcas</h3>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {marcas.map(marca => (
          <button
            key={marca.id}
            onClick={() => setMarcaSeleccionada(marca.id)}
            style={{
              padding: '10px',
              backgroundColor: marcaSeleccionada === marca.id ? '#007bff' : '#e0e0e0',
              color: marcaSeleccionada === marca.id ? '#fff' : '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            {marca.name}
          </button>
        ))}
      </div>

      <h3 style={{ marginTop: '20px' }}>Productos</h3>
      {productos.length > 0 ? (
        <ul>
          {productos.map(producto => (
            <li key={producto.id}>
              {producto.name} - ${producto.price} - Stock: {producto.stock}
            </li>
          ))}
        </ul>
      ) : (
        <p>Selecciona una marca para ver los productos.</p>
      )}
    </div>
  );
};

export default ProductosPorCategoria;
