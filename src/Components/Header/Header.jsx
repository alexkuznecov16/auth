import { Link } from 'react-router-dom';
import './Header.scss';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">MySite</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/auth">Auth</Link>
      </nav>
    </header>
  );
}

export default Header;
