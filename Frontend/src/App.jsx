import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import RutaProtegida from './components/RutaProtegida';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import CrearPedido from './pages/CrearPedido';
import MisDeudas from './pages/MisDeudas';
function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route
            path="/nuevo-pedido"
            element={
          <RutaProtegida>
        <CrearPedido />
    </RutaProtegida>
  }
/>
<Route
  path="/mis-deudas"
  element={
    <RutaProtegida>
      <MisDeudas />
    </RutaProtegida>
  }
/>
        <Route
          path="/"
          element={
            <RutaProtegida>
              <Home />
            </RutaProtegida>
          }
        />
      </Routes>
    </>
  );
}

export default App;