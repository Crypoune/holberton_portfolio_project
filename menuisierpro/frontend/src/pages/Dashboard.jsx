import { useState } from "react";
import StatCard from "../components/dashboard/StatCard";
import QuotesList from "../components/dashboard/QuotesList";
import QuotesFilters from "../components/dashboard/QuotesFilters";
import useQuotes, { DEFAULT_FILTERS } from "../hooks/useQuotes";

function Dashboard({ token, onAuthError }) {
  // Les filtres sont gérés ici puis transmis au hook et au composant
  // de filtrage. Dashboard centralise donc l'état de la page.
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

  // Hook personnalisé qui récupère toutes les données du dashboard
  // (devis, statistiques, clients récents...) ainsi que les actions
  // comme la suppression d'un devis.
  const { quotes, stats, recentClients, loading, error, deleteQuote } =
    useQuotes(token, filters, onAuthError);

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <span className="dashboard__tag">ESPACE ARTISAN</span>
        <h1>Tableau de bord</h1>
      </header>

      {/* Résumé rapide des statistiques principales */}
      <div className="dashboard__stats">
        <StatCard label="Total devis" value={stats.total} colorClass="black" />
        <StatCard
          label="En attente"
          value={stats.enAttente}
          colorClass="orange"
        />
        <StatCard label="Acceptés" value={stats.acceptes} colorClass="green" />
        <StatCard label="À relancer" value={stats.aRelancer} colorClass="red" />
      </div>

      <section className="dashboard__section">
        <h2>Devis en cours</h2>

        {/* Les filtres mettent simplement à jour le state `filters`. */}
        <QuotesFilters filters={filters} onChange={setFilters} />

        {/* Affichage conditionnel selon l'état de la requête */}
        {loading && <p className="dashboard__loading">Chargement...</p>}
        {error && <p className="dashboard__error">Erreur : {error}</p>}
        {!loading && !error && (
          <QuotesList quotes={quotes} onDelete={deleteQuote} />
        )}
      </section>

      <section className="dashboard__section">
        <h2>Dernières inscriptions</h2>

        {/* Liste des derniers clients récupérés par le hook */}
        <ul className="dashboard__recent-clients">
          {recentClients.length === 0 && (
            <li className="dashboard__recent-clients-empty">
              Aucun client récent
            </li>
          )}
          {recentClients.map((client) => (
            <li key={client.id} className="dashboard__recent-clients-item">
              <span>{client.nom}</span>
              <span>{client.telephone_whatsapp}</span>

              {/* Formatage de la date au format français */}
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
