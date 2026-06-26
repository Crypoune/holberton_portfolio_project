import {
  Compass,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  LogOut,
} from "lucide-react";

function Sidebar({ activePage, onNavigate, isConnected, onLogout }) {
  const links = [
    { id: "accueil", label: "Accueil", Icon: Compass },
    { id: "dashboard", label: "Tableau de bord", Icon: LayoutDashboard },
    { id: "portfolio", label: "Portfolio", Icon: FolderOpen },
    { id: "devis", label: "Demander un devis", Icon: MessageSquare },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <span className="sidebar__title">GEPPETTO'S HOUSE</span>
        <span className="sidebar__subtitle">MENUISERIE · MADAGASCAR</span>
      </div>

      <nav className="sidebar__nav">
        {links.map((link) => (
          <button
            key={link.id}
            className={`sidebar__link ${activePage === link.id ? "sidebar__link--active" : ""}`}
            onClick={() => onNavigate(link.id)}
          >
            <link.Icon size={18} />
            {link.label}
          </button>
        ))}
      </nav>

      {isConnected && (
        <button className="sidebar__logout" onClick={onLogout}>
          <LogOut size={18} />
          Déconnexion
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
