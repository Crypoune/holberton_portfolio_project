const STATUS_CONFIG = {
  en_attente: { label: "En attente", className: "badge--warning" },
  relance_j3: { label: "Relancé J+3", className: "badge--warning" },
  relance_j7: { label: "Relancé J+7", className: "badge--danger" },
  converti: { label: "Accepté", className: "badge--success" },
  abandonne: { label: "Abandonné", className: "badge--danger" },
};

function Badge({ statut }) {
  const config = STATUS_CONFIG[statut] ?? { label: statut, className: "" };

  return <span className={`badge ${config.className}`}>{config.label}</span>;
}

export default Badge;
