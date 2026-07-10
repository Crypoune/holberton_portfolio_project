import { useState, useEffect } from "react";
import heroBackground from "../assets/hero-background.webp";
import armoire from "../assets/portfolio/armoire.webp";
import banc from "../assets/portfolio/banc.webp";
import bureau from "../assets/portfolio/bureau.webp";
import chaiseBar from "../assets/portfolio/chaise_bar.webp";
import dressing1 from "../assets/portfolio/dressing1.webp";
import dressing2 from "../assets/portfolio/dressing2.webp";
import etagere from "../assets/portfolio/etagere.webp";
import fauteuil from "../assets/portfolio/fauteuil.webp";
import rangement from "../assets/portfolio/rangement.webp";
import tableBasse from "../assets/portfolio/table_basse.webp";
import table from "../assets/portfolio/table.webp";
import bibliotheque from "../assets/portfolio/bibliotheque.webp";

const MOCK_PROJECTS = [
  { id: 1, titre: "Armoire sur mesure", type_travaux: "Armoire", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "armoire-sur-mesure", image_principale: armoire },
  { id: 2, titre: "Banc en bois", type_travaux: "Autre", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "banc-bois", image_principale: banc },
  { id: 3, titre: "Bureau sur mesure", type_travaux: "Autre", materiau_utilise: "Bois massif", localisation: "Antsirabe", slug: "bureau-sur-mesure", image_principale: bureau },
  { id: 4, titre: "Chaise de bar", type_travaux: "Table", materiau_utilise: "Bois massif", localisation: "Antsirabe", slug: "chaise-bar", image_principale: chaiseBar },
  { id: 5, titre: "Dressing personnalisé", type_travaux: "Dressing", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "dressing-personnalise", image_principale: dressing1 },
  { id: 6, titre: "Etagère murale", type_travaux: "Autre", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "etagere-murale", image_principale: etagere },
  { id: 7, titre: "Fauteuil artisanal", type_travaux: "Autre", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "fauteuil-artisanal", image_principale: fauteuil },
  { id: 8, titre: "Meuble de rangement", type_travaux: "Armoire", materiau_utilise: "Bois massif", localisation: "Antsirabe", slug: "rangement", image_principale: rangement },  
  { id: 9, titre: "Dressing ouvert", type_travaux: "Dressing", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "dressing-ouvert", image_principale: dressing2 },
  { id: 10, titre: "Table basse artisanale", type_travaux: "Table", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "table-basse", image_principale: tableBasse },
  { id: 11, titre: "Table en bois massif", type_travaux: "Table", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "table-bois-massif", image_principale: table },
  { id: 12, titre: "Bibliothèque ouverte", type_travaux: "Bibliothèque", materiau_utilise: "Bois massif", localisation: "Antananarivo", slug: "bibliotheque-ouverte", image_principale: bibliotheque },
];

function useProjects() {
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // À activer quand Django tourne :
  // useEffect(() => {
  //   fetch('/api/v1/projects/')
  //     .then((res) => res.json())
  //     .then(setProjects)
  //     .catch((err) => setError(err.message))
  //     .finally(() => setLoading(false))
  // }, [])

  return { projects, loading, error };
}

export default useProjects;
