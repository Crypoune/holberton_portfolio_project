import { useState } from "react";
import useChantiers from "../hooks/useChantiers";

function Portfolio() {
  const { chantiers, loading, error } = useChantiers();
  const [filtre, setFiltre] = useState("Tous");

  const types = ["Tous", ...new Set(chantiers.map((c) => c.type_travaux))];

  const chantiersFiltres =
    filtre === "Tous"
      ? chantiers
      : chantiers.filter((c) => c.type_travaux === filtre);

  if (loading) return <div className="portfolio__loading">Chargement...</div>;
  if (error) return <div className="portfolio__error">Erreur : {error}</div>;

  return (
    <main className="portfolio">
      <header className="portfolio__header">
        <h1>Nos réalisations</h1>
        <p>Découvrez nos créations sur mesure réalisées avec passion</p>
      </header>

      <div className="portfolio__filters">
        {types.map((type) => (
          <button
            key={type}
            className={`portfolio__filter ${filtre === type ? "portfolio__filter--active" : ""}`}
            onClick={() => setFiltre(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="portfolio__grid">
        {chantiersFiltres.map((chantier) => (
          <div key={chantier.id} className="chantier-card">
            <img src={chantier.image_principale} alt={chantier.titre} />
            <div className="chantier-card__body">
              <h3>{chantier.titre}</h3>
              <p className="chantier-card__meta">
                {chantier.materiau_utilise} · {chantier.localisation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {chantiersFiltres.length === 0 && (
        <p className="portfolio__empty">Aucune réalisation pour ce filtre.</p>
      )}
    </main>
  );
}

export default Portfolio;
