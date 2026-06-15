function Sidebar({ activePage, onNavigate }) {
  const links = [
    { id: "dashboard", label: "Tableau de bord", icon: "🏠" },
    { id: "portfolio", label: "Portfolio", icon: "📁" },
    { id: "devis", label: "Demander un devis", icon: "💬" },
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
            <span>{link.icon}</span>
            {link.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
