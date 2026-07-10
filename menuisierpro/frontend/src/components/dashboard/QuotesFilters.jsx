const STATUTS = [
  { value: "", label: "Tous les statuts" },
  { value: "en_attente", label: "En attente" },
  { value: "relance_j3", label: "Relancé à J+3" },
  { value: "relance_j7", label: "Relancé à J+7" },
  { value: "converti", label: "Converti" },
  { value: "abandonne", label: "Abandonné" },
];

function QuotesFilters({ filters, onChange }) {
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

      <select value={filters.statut} onChange={handleField("statut")}>
        {STATUTS.map((s) => (
          <option key={s.value} value={s.value}>{s.label}</option>
        ))}
      </select>

      <select value={filters.ordering} onChange={handleField("ordering")}>
        <option value="-date_creation">Plus récents d'abord</option>
        <option value="date_creation">Plus anciens d'abord</option>
      </select>
    </div>
  );
}

export default QuotesFilters;