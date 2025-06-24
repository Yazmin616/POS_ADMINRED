import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProductosPorCategoria from './ProductosPorCategoria';

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/categories');
        setCategorias(res.data);
      } catch (err) {
        console.error('Error al cargar categorías:', err);
      }
    };
    fetchCategorias();
  }, []);

  const handleCategoriaSelect = (id) => {
    setCategoriaSeleccionada(id);
  };

  return (
    <div>
      <h2>Categorías</h2>
      <ul>
        {categorias.map(categoria => (
          <li key={categoria.id} onClick={() => handleCategoriaSelect(categoria.id)}>
            {categoria.name}
          </li>
        ))}
      </ul>

      {categoriaSeleccionada && (
        <ProductosPorCategoria categoriaId={categoriaSeleccionada} />
      )}
    </div>
  );
};

export default Categorias;
