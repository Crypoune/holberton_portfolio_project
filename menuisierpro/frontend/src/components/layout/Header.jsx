import { useState } from "react";
import { Menu, X } from "lucide-react";

function Header({ onNavigate, isConnected }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "accueil", label: "Accueil" },
    { id: "dashboard", label: isConnected ? "Tableau de bord" : "Connexion" },
    { id: "portfolio", label: "Portfolio" },
    { id: "devis", label: "Demander un devis" },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar__brand" onClick={() => handleNav("accueil")}>
        <span className="navbar__title">GEPPETTO'S HOUSE</span>
        <span className="navbar__subtitle">MENUISERIE · MADAGASCAR</span>
      </div>

      <button className="navbar__burger" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {menuOpen && (
        <nav className="navbar__mobile-menu">
          {links.map((link) => (
            <button
              key={link.id}
              className="navbar__mobile-link"
              onClick={() => handleNav(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

export default Header;
