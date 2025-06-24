import React, { useState } from 'react';
import Inventario from '../components/Inventario';
import Ventas from '../components/Ventas';
import Categorias from '../components/Categorias';
import '../styles/Admin.css'

function DashboardAdmin({ user, onLogout }) {
  const [view, setView] = useState('inventario');

  const renderView = () => {
    switch (view) {
      case 'inventario':
        return <Inventario />;
      case 'ventas':
        return <Ventas />;
      case 'categorias':
        return <Categorias />;
      default:
        return <h2>Bienvenido {user.username}</h2>;
    }
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Panel de Administración</h1>
      <div className="nav-buttons">
        <button onClick={() => setView('ventas')}>Ventas</button>
      </div>
      <div className="dashboard-view">
        {renderView()}
      </div>
    </div>
  );
}

export default DashboardAdmin;
