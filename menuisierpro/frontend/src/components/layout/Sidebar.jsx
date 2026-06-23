import {
  Compass,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
} from "lucide-react";

function Sidebar({ activePage, onNavigate }) {
  const links = [
    { id: "accueil", label: "Accueil", Icon: Compass },
    { id: "dashboard", label: "Tableau de bord", Icon: LayoutDashboard },
    { id: "portfolio", label: "Portfolio", Icon: FolderOpen },
    { id: "devis", label: "Demander un devis", Icon: MessageSquare },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <h1>Geppetto's House</h1>
        <p>Menuiserie à Madagascar</p>
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
    </aside>
  );
}

export default Sidebar;
