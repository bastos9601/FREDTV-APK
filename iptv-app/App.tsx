import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/contexto/AuthContext';
import { NavegacionPrincipal } from './src/navegacion/NavegacionPrincipal';

export default function App() {
  return (
    <AuthProvider>
      <NavegacionPrincipal />
      <StatusBar style="light" backgroundColor="#141414" />
    </AuthProvider>
  );
}
