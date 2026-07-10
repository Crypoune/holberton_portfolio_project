import { useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import QuotesList from "../components/dashboard/QuotesList";
import QuotesFilters from "../components/dashboard/QuotesFilters";
import useQuotes, { DEFAULT_FILTERS } from "../hooks/useQuotes";

function Dashboard({ token, onAuthError }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { quotes, stats, recentClients, loading, error, deleteQuote } = useQuotes(token, filters);
  const { quotes, stats, recentClients, loading, error, deleteQuote } =
    useQuotes(token, filters, onAuthError);
    
  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <span className="dashboard__tag">ESPACE ARTISAN</span>
        <h1>Tableau de bord</h1>
      </header>

      <div className="dashboard__stats">
        <StatCard label="Total devis" value={stats.total} colorClass="black" />
        <StatCard label="En attente" value={stats.enAttente} colorClass="orange" />
        <StatCard label="Acceptés" value={stats.acceptes} colorClass="green" />
        <StatCard label="À relancer" value={stats.aRelancer} colorClass="red" />
      </div>

      <section className="dashboard__section">
        <h2>Devis en cours</h2>
        <QuotesFilters filters={filters} onChange={setFilters} />

        {loading && <p className="dashboard__loading">Chargement...</p>}
        {error && <p className="dashboard__error">Erreur : {error}</p>}
        {!loading && !error && (
          <QuotesList quotes={quotes} onDelete={deleteQuote} />
        )}
      </section>

      <section className="dashboard__section">
        <h2>Dernières inscriptions</h2>
        <ul className="dashboard__recent-clients">
          {recentClients.length === 0 && (
            <li className="dashboard__recent-clients-empty">Aucun client récent</li>
          )}
          {recentClients.map((client) => (
            <li key={client.id} className="dashboard__recent-clients-item">
              <span>{client.nom}</span>
              <span>{client.telephone_whatsapp}</span>
              <time dateTime={client.date_creation}>
                {new Date(client.date_creation).toLocaleDateString("fr-FR")}
              </time>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default Dashboard;