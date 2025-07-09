import { useEffect, useState } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

function NavBar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    try {
      if (!storedUser || storedUser === "undefined" || storedUser === "null") {
        return null;
      }
      return JSON.parse(storedUser);
    } catch (e) {
      console.error("Erreur de parsing du user : ", e);
      return null;
    }
  });

  useEffect(() => {
    const syncUser = () => {
      setToken(localStorage.getItem('token'));
      const storedUser = localStorage.getItem('user');
      try {
        if (!storedUser || storedUser === "undefined" || storedUser === "null") {
          setUser(null);
        } else {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.error("Erreur de parsing dans useEffect : ", e);
        setUser(null);
      }
    };

    window.addEventListener('storage', syncUser);
    return () => window.removeEventListener('storage', syncUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
    navigate('/login');
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary fixed-top">
      <Container>
        <Navbar.Brand as={Link} to="/">Pokedex</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/choosePokemon">Mini-jeux</Nav.Link>
            {token && <Nav.Link as={Link} to="/profile">Profil</Nav.Link>}
          </Nav>

          <Nav className="ms-auto align-items-center">
            {user ? (
              <div className="d-flex align-items-center">
                <span className="me-3">Bienvenue, <strong>{user.name}</strong></span>
                <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                  Déconnexion
                </Button>
              </div>
            ) : (
              <>
                <Nav.Link as={Link} to="/register">Inscription</Nav.Link>
                <Nav.Link as={Link} to="/login">Connexion</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;
