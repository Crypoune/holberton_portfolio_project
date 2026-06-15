import DevisCard from "./DevisCard";

function DevisList({ devis }) {
  if (!devis || devis.length === 0) {
    return <p className="devis-list__empty">Aucun devis en cours.</p>;
  }

  return (
    <div className="devis-list">
      {devis.map((d) => (
        <DevisCard key={d.id} devis={d} />
      ))}
    </div>
  );
}

export default DevisList;
