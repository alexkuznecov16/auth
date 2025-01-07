import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} MySite. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
