import { useAuth } from '../context/AuthContext';
import MisPedidos from './MisPedidos';
import PanelAdmin from './PanelAdmin';

function Home() {
  const { usuario } = useAuth();

  if (usuario.rol === 'admin') {
    return <PanelAdmin />;
  }

  return <MisPedidos />;
}

export default Home;