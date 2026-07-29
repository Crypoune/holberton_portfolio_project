import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

// Import du SCSS global.
// Vite compile automatiquement le SCSS en CSS.
import "./styles/main.scss";

import App from "./App.jsx";

// Point d'entrée de l'application React.
// createRoot monte <App /> dans <div id="root"> de index.html.
//
// StrictMode : outil de développement.
// Détecte certaines mauvaises pratiques, sans impact en production.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
