import StatCard from "../components/dashboard/StatCard";
import QuotesList from "../components/dashboard/QuotesList";
import useQuotes from "../hooks/useQuotes";

function Dashboard() {
  const { quotes, stats, loading, error } = useQuotes();

  if (loading) return <div className="dashboard__loading">Chargement...</div>;
  if (error) return <div className="dashboard__error">Erreur : {error}</div>;

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <span className="dashboard__tag">ESPACE ARTISAN</span>
        <h1>Tableau de bord</h1>
      </header>

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
        <p className="dashboard__subtitle">
          Cliquez sur le bouton WhatsApp pour relancer vos clients
        </p>
        <QuotesList quotes={quotes} />
      </section>
    </main>
  );
}

export default Dashboard;
