import { Link } from 'react-router-dom';

const Navigation = ({ onLogout }) => {
  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/dashboard" className="nav-brand">
          Nutrinee
        </Link>
        
        <ul className="nav-links">
          <li><Link to="/dashboard">Dashboard</Link></li>
          <li><Link to="/weight-history">Histórico de Peso</Link></li>
          <li><Link to="/exercise-data">Dados de Exercício</Link></li>
          <li><Link to="/profile">Perfil</Link></li>
        </ul>
        
        <button onClick={onLogout} className="logout-btn">
          Sair
        </button>
      </div>
    </nav>
  );
};

export default Navigation;