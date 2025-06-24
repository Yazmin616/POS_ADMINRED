import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa para redirigir
import Inventario from '../components/Inventario';
import Ventas from '../components/Ventas';
import Categorias from '../components/Categorias';
import AgregarProducto from '../components/AgregarProducto';
import '../styles/Admin.css';

function DashboardAdmin({ user, onLogout }) {
  const [view, setView] = useState('inventario');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');  // Elimina token
    if (onLogout) onLogout();           // Limpia estado padre si existe
    navigate('/');                 // Redirige a login
  };

  const renderView = () => {
    switch (view) {
      case 'inventario':
        return <Inventario />;
      case 'ventas':
        return <Ventas />;
      case 'categorias':
        return <Categorias />;
      case 'agregarProducto':
        return <AgregarProducto onClose={() => setView('inventario')} />;
      default:
        return <h2>Bienvenido {user.username}</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Administración</h1>
      <div className="nav-buttons">
        <button onClick={() => setView('inventario')}>Inventario</button>
        <button onClick={() => setView('ventas')}>Ventas</button>
        <button onClick={() => setView('categorias')}>Categorías</button>
        <button onClick={() => setView('agregarProducto')}>➕ Agregar Producto</button>
        {/* Aquí agregamos el botón cerrar sesión */}
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
      <div className="dashboard-view">
        {renderView()}
      </div>
    </div>
  );
}

export default DashboardAdmin;
