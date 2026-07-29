// Associe chaque statut du back à son affichage dans l'interface (texte + couleur du badge).
// Ainsi, toute la configuration est regroupée au même endroit.
const STATUS_CONFIG = {
  en_attente: { label: "En attente", className: "badge--warning" },
  relance_j3: { label: "Relancé J+3", className: "badge--warning" },
  relance_j7: { label: "Relancé J+7", className: "badge--danger" },
  converti: { label: "Accepté", className: "badge--success" },
  abandonne: { label: "Abandonné", className: "badge--danger" },
};

function Badge({ statut }) {
  // Si un statut n'est pas encore prévu, on affiche sa valeur
  // afin d'éviter un badge vide et de garder l'interface fonctionnelle.
  const config = STATUS_CONFIG[statut] ?? { label: statut, className: "" };

  return <span className={`badge ${config.className}`}>{config.label}</span>;
}

export default Badge;
