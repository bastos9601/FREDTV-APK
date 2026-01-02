import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { SplashPantalla } from '../pantallas/SplashPantalla';
import { LoginPantalla } from '../pantallas/LoginPantalla';
import { NuevaInicioPantalla } from '../pantallas/NuevaInicioPantalla';
import { NuevaTvEnVivoPantalla } from '../pantallas/NuevaTvEnVivoPantalla';
import { PeliculasPantalla } from '../pantallas/PeliculasPantalla';
import { SeriesPantalla } from '../pantallas/SeriesPantalla';
import { PerfilPantalla } from '../pantallas/PerfilPantalla';
import { DetallesPeliculaPantalla } from '../pantallas/DetallesPeliculaPantalla';
import { DetallesSeriePantalla } from '../pantallas/DetallesSeriePantalla';
import { ReproductorProfesional } from '../pantallas/ReproductorProfesional';
import { useAuth } from '../contexto/AuthContext';
import { COLORS } from '../utils/constantes';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.border,
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textSecondary,
        headerShown: false, // Ocultar headers de todas las pantallas
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={NuevaInicioPantalla}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="TV"
        component={NuevaTvEnVivoPantalla}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="tv" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Películas"
        component={PeliculasPantalla}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="film" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Series"
        component={SeriesPantalla}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="play-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={PerfilPantalla}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const NavegacionPrincipal = () => {
  const { usuario, cargando } = useAuth();
  const [mostrarSplash, setMostrarSplash] = useState(true);

  // Mostrar splash solo la primera vez que se carga la app
  useEffect(() => {
    const timer = setTimeout(() => {
      setMostrarSplash(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // Mostrar splash screen
  if (mostrarSplash) {
    return <SplashPantalla onFinish={() => setMostrarSplash(false)} />;
  }

  // Mostrar loading mientras se verifica la autenticación
  if (cargando) {
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.card,
          },
          headerTintColor: COLORS.text,
          contentStyle: {
            backgroundColor: COLORS.background,
          },
        }}
      >
        {!usuario ? (
          <Stack.Screen
            name="Login"
            component={LoginPantalla}
            options={{ headerShown: false }}
          />
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={TabNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="DetallesPelicula"
              component={DetallesPeliculaPantalla}
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="DetallesSerie"
              component={DetallesSeriePantalla}
              options={{
                headerShown: false,
                animation: 'slide_from_right',
              }}
            />
            <Stack.Screen
              name="Reproductor"
              component={ReproductorProfesional}
              options={{
                headerShown: false,
                animation: 'fade',
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
