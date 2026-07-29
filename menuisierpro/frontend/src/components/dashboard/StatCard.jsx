// Composant de présentation réutilisable.
//
// Son rôle est uniquement d'afficher une statistique sous forme de carte.
// Il reçoit les informations à afficher via ses props :
// - label : le nom de la statistique (ex : "Devis en attente")
// - value : la valeur à afficher
// - colorClass : une classe CSS pour adapter l'apparence.
//
// Aucune logique métier n'est présente ici :
// les valeurs sont préparées par le composant parent (Dashboard.jsx),
// puis transmises à StatCard.
// Cela permet de réutiliser cette carte pour plusieurs statistiques
// sans dupliquer le code.
function StatCard({ label, value, colorClass }) {
  return (
    <div className="stat-card">
      <span className={`stat-card__value ${colorClass}`}>{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

export default StatCard;
