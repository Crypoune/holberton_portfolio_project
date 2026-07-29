import { useState } from "react";
import { X } from "lucide-react";
import useProjects from "../hooks/useProjects";

function Portfolio() {
  // Récupération des projets via le hook custom.
  // Actuellement : données mockées en dur (MOCK_PROJECTS).
  // Roadmap : bascule vers l'API réelle via une variable d'env
  // (ex. VITE_USE_MOCK_DATA) une fois le backend connecté.
  const { projects, loading, error } = useProjects();

  // Filtre actif sélectionné par l'utilisateur ("Tous" par défaut)
  const [filtre, setFiltre] = useState("Tous");

  // Projet actuellement affiché dans la lightbox (null = lightbox fermée)
  const [selected, setSelected] = useState(null);

  // Génère dynamiquement la liste des types de travaux disponibles
  // à partir des données, sans doublons (Set), en ajoutant "Tous" en premier
  const types = ["Tous", ...new Set(projects.map((p) => p.type_travaux))];

  // Applique le filtre sélectionné sur la liste complète des projets
  const projectsFiltres =
    filtre === "Tous"
      ? projects
      : projects.filter((p) => p.type_travaux === filtre);

  // Gestion des états de chargement et d'erreur avant le rendu principal
  if (loading) return <div className="portfolio__loading">Chargement...</div>;
  if (error) return <div className="portfolio__error">Erreur : {error}</div>;

  return (
    <main className="portfolio">
      <header className="portfolio__header">
        <h1>Nos réalisations</h1>
        <p>Découvrez nos créations sur mesure réalisées avec passion</p>
      </header>

      {/* Barre de filtres : un bouton par type de travaux + "Tous" */}
      <div className="portfolio__filters">
        {types.map((type) => (
          <button
            key={type}
            // Ajoute la classe --active uniquement sur le filtre sélectionné
            className={`portfolio__filter ${filtre === type ? "portfolio__filter--active" : ""}`}
            onClick={() => setFiltre(type)}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Grille des projets filtrés, cliquables pour ouvrir la lightbox */}
      <div className="portfolio__grid">
        {projectsFiltres.map((project) => (
          <div
            key={project.id}
            className="project-card"
            onClick={() => setSelected(project)}
          >
            {/* Image en background pour un rendu type "cover" facile en CSS */}
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

      {/* Message affiché si le filtre actif ne retourne aucun résultat */}
      {projectsFiltres.length === 0 && (
        <p className="portfolio__empty">Aucune réalisation pour ce filtre.</p>
      )}

      {/* Lightbox : ne s'affiche que si un projet est sélectionné */}
      {selected && (
        // Clic n'importe où sur l'overlay (le fond sombre) = fermeture
        <div className="lightbox" onClick={() => setSelected(null)}>
          <button className="lightbox__close" onClick={() => setSelected(null)}>
            <X size={24} />
          </button>
          <div
            className="lightbox__content"
            // stopPropagation empêche le clic dans le contenu de fermer la lightbox
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
