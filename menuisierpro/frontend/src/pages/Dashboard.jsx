import StatCard from "../components/dashboard/StatCard";
import DevisList from "../components/dashboard/DevisList";
import useDevis from "../hooks/useDevis";

function Dashboard() {
  const { devis, stats, loading, error } = useDevis();

  if (loading) return <div className="dashboard__loading">Chargement...</div>;
  if (error) return <div className="dashboard__error">Erreur : {error}</div>;

  return (
    <main className="dashboard">
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
        <DevisList devis={devis} />
      </section>
    </main>
  );
}

export default Dashboard;
