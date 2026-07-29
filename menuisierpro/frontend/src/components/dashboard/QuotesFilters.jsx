// Liste des statuts affichés dans le filtre.
// Les valeurs correspondent à celles attendues par l'API,
// le label est simplement le texte affiché à l'utilisateur.
const STATUTS = [
  { value: "", label: "Tous les statuts" },
  { value: "en_attente", label: "En attente" },
  { value: "relance_j3", label: "Relancé à J+3" },
  { value: "relance_j7", label: "Relancé à J+7" },
  { value: "converti", label: "Converti" },
  { value: "abandonne", label: "Abandonné" },
];

function QuotesFilters({ filters, onChange }) {
  // Génère automatiquement le handler pour chaque champ.
  // On met à jour uniquement la propriété concernée et on conserve les autres filtres.
  const handleField = (field) => (e) => {
    onChange({ ...filters, [field]: e.target.value });
  };

  return (
    <div className="quotes-filters">
      <input
        type="text"
        placeholder="Filtrer par matériau (ex: chêne)"
        value={filters.materiau}
        onChange={handleField("materiau")}
      />

      <input
        type="text"
        placeholder="Filtrer par type de meuble (ex: table)"
        value={filters.type_meuble}
        onChange={handleField("type_meuble")}
      />

      {/* Les options sont générées à partir du tableau STATUTS. */}
      <select value={filters.statut} onChange={handleField("statut")}>
        {STATUTS.map((s) => (
          <option key={s.value} value={s.value}>
            {s.label}
          </option>
        ))}
      </select>

      {/* Le préfixe "-" indique un tri décroissant, selon la convention DRF.
          La valeur est envoyée telle quelle à l'API. */}
      <select value={filters.ordering} onChange={handleField("ordering")}>
        <option value="-date_creation">Plus récents d'abord</option>
        <option value="date_creation">Plus anciens d'abord</option>
      </select>
    </div>
  );
}

export default QuotesFilters;
