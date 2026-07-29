import {
  Compass,
  LayoutDashboard,
  FolderOpen,
  MessageSquare,
  LogOut,
  Lock,
} from "lucide-react";

// Sidebar principale de navigation.
// Elle affiche les liens accessibles aux visiteurs, puis adapte les actions disponibles selon l'état de connexion.
// La page active est reçue par props pour appliquer un style différent sans utiliser de logique de routing ici.
function Sidebar({ activePage, onNavigate, isConnected, onLogout, isOpen }) {
  // Liens publics accessibles à tous les visiteurs.
  // Chaque entrée contient un id utilisé pour la navigation, un label affiché et l'icône correspondante.
  const publicLinks = [
    { id: "accueil", label: "Accueil", Icon: Compass },
    { id: "portfolio", label: "Portfolio", Icon: FolderOpen },
    { id: "devis", label: "Demander un devis", Icon: MessageSquare },
  ];

  return (
    // L'ouverture/fermeture est gérée uniquement par une classe CSS.
    // React change l'état, puis le CSS applique l'animation.
    <aside className={`sidebar ${isOpen ? "" : "sidebar--closed"}`}>
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
            {/* L'icône est stockée directement dans le tableau.
                Cela permet de rendre dynamiquement le bon composant
                sans condition selon le lien. */}
            <link.Icon size={18} />
            {link.label}
          </button>
        ))}

        <hr style={{ border: "0.5px solid #e5e7eb", margin: "1rem 0" }} />

        {/* Le contenu de la partie basse dépend de l'état de connexion :
            - connecté : accès dashboard + déconnexion
            - non connecté : accès espace artisan */}
        {isConnected ? (
          <>
            <button
              className={`sidebar__link ${activePage === "dashboard" ? "sidebar__link--active" : ""}`}
              onClick={() => onNavigate("dashboard")}
            >
              <LayoutDashboard size={18} />
              Tableau de bord
            </button>

            <button
              className="sidebar__link"
              onClick={onLogout}
              style={{ color: "#ef4444" }}
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </>
        ) : (
          // Bouton permettant aux artisans d'accéder à l'espace privé.
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

      {isConnected && (
        // Bouton de déconnexion fixe affiché en bas de la sidebar.
        <button className="sidebar__logout" onClick={onLogout}>
          <LogOut size={18} />
          Déconnexion
        </button>
      )}
    </aside>
  );
}

export default Sidebar;
