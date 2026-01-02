import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../componentes/Input';
import { Boton } from '../componentes/Boton';
import { useAuth } from '../contexto/AuthContext';
import './LoginPantalla.css';

export const LoginPantalla = () => {
  const [usuario, setUsuario] = React.useState('');
  const [contrasena, setContrasena] = React.useState('');
  const [cargando, setCargando] = React.useState(false);
  const [error, setError] = React.useState('');
  const { iniciarSesion, usuario: usuarioAutenticado } = useAuth();
  const navigate = useNavigate();

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (usuarioAutenticado) {
      console.log('Usuario ya autenticado, redirigiendo...');
      navigate('/inicio', { replace: true });
    }
  }, [usuarioAutenticado, navigate]);

  const manejarLogin = async () => {
    if (!usuario || !contrasena) {
      setError('Por favor ingresa usuario y contraseña');
      return;
    }

    setCargando(true);
    setError('');
    try {
      console.log('Intentando iniciar sesión con:', usuario);
      await iniciarSesion(usuario, contrasena);
      console.log('Inicio de sesión exitoso');
      // La redirección se hará automáticamente por el useEffect
    } catch (error: any) {
      console.error('Error en login:', error);
      setError(error.message || 'Credenciales inválidas. Por favor intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const manejarKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      manejarLogin();
    }
  };

  return (
    <div className="login-container">
      <div className="login-overlay">
        <div className="login-content">
          <div className="logo-container">
            <div className="logo-circle">
              <span className="logo-icon">📺</span>
            </div>
            <h1 className="titulo">FRED TV</h1>
            <p className="subtitulo">Tu entretenimiento sin límites</p>
          </div>
          
          <div className="formulario">
            <div className="card">
              <h2 className="card-title">Iniciar Sesión</h2>
              
              {error && <div className="error-message">{error}</div>}
              
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <Input
                  placeholder="Usuario"
                  value={usuario}
                  onChange={setUsuario}
                  onKeyPress={manejarKeyPress}
                />
              </div>
              
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <Input
                  placeholder="Contraseña"
                  value={contrasena}
                  onChange={setContrasena}
                  type="password"
                  onKeyPress={manejarKeyPress}
                />
              </div>
              
              <div className="boton-container">
                <Boton
                  titulo="Iniciar Sesión"
                  onClick={manejarLogin}
                  cargando={cargando}
                />
              </div>
            </div>
          </div>

          <div className="footer">
            <p className="footer-text">FRED TV</p>
            <p className="footer-subtext">Versión Web 1.0.0</p>
          </div>
        </div>
      </div>
    </div>
  );
};
