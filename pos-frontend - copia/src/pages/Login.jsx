import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Hook para redirigir

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Por favor, ingresa usuario y contraseña');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        username,
        password,
      });

      // Guardar token
      localStorage.setItem('token', res.data.token);

      // Redireccionar según el rol recibido
      const role = res.data.user.role; // Cambié 'rol' a 'role' para mayor consistencia
      if (role === 'admin') {
        navigate('/dashboard-admin');
      } else if (role === 'employee') {
        navigate('/dashboard-employee');
      } else {
        setError('Rol no reconocido');
      }
    } catch (err) {
      console.error('Error de login:', err.response ? err.response.data : err);
      setError(err.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
  <h2 className="login-title">Iniciar sesión</h2>
  <form onSubmit={handleLogin} className="login-form">
    <div className="form-group">
      <label>Usuario</label>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Escribe tu usuario"
      />
    </div>
    <div className="form-group">
      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Escribe tu contraseña"
      />
    </div>
    <button type="submit">Iniciar sesión</button>
  </form>

  {error && <p className="error">{error}</p>}
</div>

  );
};

export default Login;
