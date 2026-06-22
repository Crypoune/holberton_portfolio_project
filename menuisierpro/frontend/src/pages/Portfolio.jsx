import { useState } from "react";
import useProjects from "../hooks/useProjects";

function Portfolio() {
  const { projects, loading, error } = useProjects();
  const [filter, setFilter] = useState("Tous");

  const types = ["Tous", ...new Set(projects.map((p) => p.type_travaux))];

  const projectsFilters =
    filter === "Tous"
      ? projects
      : projects.filter((p) => p.type_travaux === filter);

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
            className={`portfolio__filter ${filter === type ? "portfolio__filter--active" : ""}`}
            onClick={() => setFilter(type)}
          >
            {type}
          </button>
        ))}
      </div>

      <div className="portfolio__grid">
        {projectsFilters.map((project) => (
          <div key={project.id} className="project-card">
            <img src={project.image_principale} alt={project.titre} />
            <div className="project-card__body">
              <h3>{project.titre}</h3>
              <p className="project-card__meta">
                {project.materiau_utilise} · {project.localisation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {projectsFilters.length === 0 && (
        <p className="portfolio__empty">Aucune réalisation pour ce filtre.</p>
      )}
    </main>
  );
}

export default Portfolio;
