import QuotesCard from "./QuotesCard";

// Affiche la liste des devis et délègue l'affichage d'un devis individuel à QuotesCard.
function QuotesList({ quotes, onDelete }) {
  // Affiche un message clair si aucun devis n'est disponible.
  if (!quotes || quotes.length === 0) {
    return <p className="quotes-list__empty">Aucun devis en cours.</p>;
  }

  return (
    <div className="quotes-list">
      {quotes.map((q) => (
        // L'id du devis est utilisé comme clé unique pour garder une liste stable lors des modifications.
        <QuotesCard key={q.id} quotes={q} onDelete={onDelete} />
      ))}
    </div>
  );
}

export default QuotesList;
