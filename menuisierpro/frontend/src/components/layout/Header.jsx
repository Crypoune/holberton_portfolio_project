import { useState } from "react";

function Header({ onNavigate }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { id: "accueil", label: "Accueil" },
    { id: "dashboard", label: "Tableau de bord" },
    { id: "portfolio", label: "Portfolio" },
    { id: "devis", label: "Demander un devis" },
  ];

  const handleNav = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header__top">
        <span className="header__brand">Geppetto's House</span>
        <button
          className="header__burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>
      {menuOpen && (
        <nav className="header__menu">
          {links.map((link) => (
            <button
              key={link.id}
              className="header__menu-link"
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
