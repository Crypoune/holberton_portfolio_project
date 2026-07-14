import { useState } from "react";
import { X } from "lucide-react";
import useProjects from "../hooks/useProjects";

function Portfolio() {
  const { projects, loading, error } = useProjects();
  const [filtre, setFiltre] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const types = ["Tous", ...new Set(projects.map((p) => p.type_travaux))];
  const projectsFiltres =
    filtre === "Tous"
      ? projects
      : projects.filter((p) => p.type_travaux === filtre);

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
        {projectsFiltres.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => setSelected(project)}
          >
            <div
              className="project-card__image"
              style={{ backgroundImage: `url(${project.image_principale})` }}
            />
            <div className="project-card__body">
              <h3>{project.titre}</h3>
              <p className="project-card__meta">
                {project.materiau_utilise} · {project.localisation}
              </p>
            </div>
          </div>
        ))}
      </div>

      {projectsFiltres.length === 0 && (
        <p className="portfolio__empty">Aucune réalisation pour ce filtre.</p>
      )}

      {selected && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <button className="lightbox__close" onClick={() => setSelected(null)}>
            <X size={24} />
          </button>
          <div
            className="lightbox__content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={selected.image_principale} alt={selected.titre} />
            <div className="lightbox__info">
              <h3>{selected.titre}</h3>
              <p>
                {selected.materiau_utilise} · {selected.localisation}
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Portfolio;
