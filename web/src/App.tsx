import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexto/AuthContext';
import { LoginPantalla } from './pantallas/LoginPantalla';
import { NuevaInicioPantalla } from './pantallas/NuevaInicioPantalla';
import { FavoritosPantalla } from './pantallas/FavoritosPantalla';
import { TvEnVivoPantalla } from './pantallas/TvEnVivoPantalla';
import { PeliculasPantalla } from './pantallas/PeliculasPantalla';
import { DetallesPeliculaPantalla } from './pantallas/DetallesPeliculaPantalla';
import { SeriesPantalla } from './pantallas/SeriesPantalla';
import { DetallesSeriePantalla } from './pantallas/DetallesSeriePantalla';
import { ReproductorProfesionalV2 } from './pantallas/ReproductorProfesionalV2';
import { Navegacion } from './componentes/Navegacion';
import './App.css';

const RutaProtegida: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="cargando-app">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Navegacion />
      {children}
    </>
  );
};

const LoginRoute = () => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return (
      <div className="cargando-app">
        <div className="spinner"></div>
        <p>Cargando...</p>
      </div>
    );
  }

  if (usuario) {
    return <Navigate to="/inicio" replace />;
  }

  return <LoginPantalla />;
};

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginRoute />} />
          <Route
            path="/inicio"
            element={
              <RutaProtegida>
                <NuevaInicioPantalla />
              </RutaProtegida>
            }
          />
          <Route
            path="/favoritos"
            element={
              <RutaProtegida>
                <FavoritosPantalla />
              </RutaProtegida>
            }
          />
          <Route
            path="/tv-en-vivo"
            element={
              <RutaProtegida>
                <TvEnVivoPantalla />
              </RutaProtegida>
            }
          />
          <Route
            path="/peliculas"
            element={
              <RutaProtegida>
                <PeliculasPantalla />
              </RutaProtegida>
            }
          />
          <Route
            path="/pelicula/:peliculaId"
            element={
              <RutaProtegida>
                <DetallesPeliculaPantalla />
              </RutaProtegida>
            }
          />
          <Route
            path="/series"
            element={
              <RutaProtegida>
                <SeriesPantalla />
              </RutaProtegida>
            }
          />
          <Route
            path="/serie/:serieId"
            element={
              <RutaProtegida>
                <DetallesSeriePantalla />
              </RutaProtegida>
            }
          />
          <Route
            path="/reproductor"
            element={
              <RutaProtegida>
                <ReproductorProfesionalV2 />
              </RutaProtegida>
            }
          />
          <Route path="/" element={<Navigate to="/inicio" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
