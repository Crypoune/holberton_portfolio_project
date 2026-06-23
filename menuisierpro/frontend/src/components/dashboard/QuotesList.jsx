import QuotesCard from "./QuotesCard";

function QuotesList({ quotes }) {
  if (!quotes || quotes.length === 0) {
    return <p className="quotes-list__empty">Aucun devis en cours.</p>;
  }

  return (
    <div className="quotes-list">
      {quotes.map((q) => (
        <QuotesCard key={q.id} quotes={q} />
      ))}
    </div>
  );
}

export default QuotesList;
