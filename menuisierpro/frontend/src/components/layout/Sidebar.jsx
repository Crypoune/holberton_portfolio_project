import { Compass, LayoutDashboard, FolderOpen, MessageSquare, LogOut, Lock } from "lucide-react";

function Sidebar({ activePage, onNavigate, isConnected, onLogout }) {
  // Les liens visibles par TOUT LE MONDE (les clients)
  const publicLinks = [
    { id: "accueil", label: "Accueil", Icon: Compass },
    { id: "portfolio", label: "Portfolio", Icon: FolderOpen },
    { id: "devis", label: "Demander un devis", Icon: MessageSquare },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h1>GEPPETTO'S HOUSE</h1>
      </div>
      
      <nav className="sidebar__nav">
        {publicLinks.map((link) => (
          <button
            key={link.id}
            className={`sidebar__link ${activePage === link.id ? "sidebar__link--active" : ""}`}
            onClick={() => onNavigate(link.id)}
          >
            <link.Icon size={18} />
            {link.label}
          </button>
        ))}

        <hr style={{ border: "0.5px solid #e5e7eb", margin: "1rem 0" }} />

        {/* SI CONNECTÉ : On montre le Tableau de bord et le bouton de Déconnexion */}
        {isConnected ? (
          <>
            <button
              className={`sidebar__link ${activePage === "dashboard" ? "sidebar__link--active" : ""}`}
              onClick={() => onNavigate("dashboard")}
            >
              <LayoutDashboard size={18} />
              Tableau de bord
            </button>
            
            <button className="sidebar__link" onClick={onLogout} style={{ color: "#ef4444" }}>
              <LogOut size={18} />
              Déconnexion
            </button>
          </>
        ) : (
          /* SI ANONYME : On montre juste un bouton discret d'accès à l'administration tout en bas */
          <button
            className={`sidebar__link ${activePage === "login" ? "sidebar__link--active" : ""}`}
            onClick={() => onNavigate("login")}
            style={{ fontSize: "0.8rem", opacity: 0.6 }}
          >
            <Lock size={14} />
            Espace Artisan
          </button>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;