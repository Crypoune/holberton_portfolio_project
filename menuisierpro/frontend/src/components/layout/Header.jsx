import { useState } from "react";
import { Menu, X } from "lucide-react";

// Header gère la barre de navigation principale.
// Il reçoit les actions depuis App.jsx (navigation et sidebar), mais ne gère pas directement le changement de page.
function Header({ onNavigate, isConnected, onToggleSidebar }) {
  // State local utilisé uniquement pour ouvrir/fermer le menu burger sur mobile.
  const [menuOpen, setMenuOpen] = useState(false);

  // Les liens affichés dans le menu.
  // Le lien dashboard s'adapte selon l'état de connexion :
  // - non connecté -> accès à la page de connexion
  // - connecté -> accès au dashboard
  const links = [
    { id: "accueil", label: "Accueil" },
    { id: "dashboard", label: isConnected ? "Tableau de bord" : "Connexion" },
    { id: "portfolio", label: "Portfolio" },
    { id: "devis", label: "Demander un devis" },
  ];

  // Navigation + fermeture automatique du menu mobile après avoir choisi une page.
  const handleNav = (id) => {
    onNavigate(id);
    setMenuOpen(false);
  };

  return (
    <>
      {/* Bouton desktop pour afficher ou masquer la sidebar */}
      <button className="sidebar-toggle" onClick={onToggleSidebar}>
        <Menu size={20} />
      </button>

      <header className="navbar">
        <div className="navbar__brand" onClick={() => handleNav("accueil")}>
          <span className="navbar__title">GEPPETTO'S HOUSE</span>
          <span className="navbar__subtitle">MENUISERIE · MADAGASCAR</span>
        </div>

        {/* Bouton burger utilisé uniquement sur mobile */}
        <button
          className="navbar__burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
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
    </>
  );
}

export default Header;
