import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardEmployee from './pages/DashboardEmployee';
import ProductosPorCategoria from './components/ProductosPorCategoria'; // Importar el componente
import Inventario from './components/Inventario';  // Importar el componente Inventario

const App = () => {
  return (
      <Routes>
        {/* Ruta por defecto */}
        <Route path="/" element={<Login />} />
        <Route path="/dashboard-admin" element={<DashboardAdmin />} />
        <Route path="/dashboard-employee" element={<DashboardEmployee />} />
        <Route
          path="/productos/:categoriaId"
          element={<ProductosPorCategoria />}
        />
        <Route path="/inventario" element={<Inventario />} />

      </Routes>
  );
};

export default App;
