import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import About from "./pages/About";
import LegalMention from "./pages/LegalMention";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import RequestQuote from "./pages/RequestQuote";
import Login from "./pages/Login";
import Workshop from "./pages/Workshop";

function App() {
  // Navigation gérée avec un useState.
  // Choix volontaire : projet simple, pas besoin de React Router.

  // Page actuellement affichée.
  const [activePage, setActivePage] = useState("accueil");

  // Token d'authentification.
  // Initialisé depuis localStorage pour conserver la session.
  // localStorage : simple à utiliser mais moins sécurisé qu'un cookie HttpOnly.
  const [token, setToken] = useState(localStorage.getItem("token"));

  // État d'ouverture de la barre latérale.
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Connexion réussie :
  // - stockage du token
  // - mise à jour de l'état
  // - ouverture du dashboard
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("token", newToken); // Persistance de la session.
    setToken(newToken); // Mise à jour de React.
    setActivePage("dashboard"); // Navigation vers le dashboard.
  };

  // Déconnexion utilisateur.
  // Également utilisé si le backend refuse le token (401/403).
  const handleLogout = () => {
    localStorage.removeItem("token"); // Suppression du token.
    setToken(null); // Mise à jour de React.
    setActivePage("accueil"); // Retour à l'accueil.
  };

  return (
    <div className="app">
      {/* Navigation latérale */}
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isConnected={!!token}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
      />
      {/* Barre supérieure */}
      <Header
        onNavigate={setActivePage}
        isConnected={!!token}
        onToggleSidebar={() => setSidebarOpen((v) => !v)} // Inverse l'état actuel de la sidebar (ouverte <-> fermée).
      />

      {/* Zone principale de l'application */}
      <div
        className={`app__content ${sidebarOpen ? "" : "app__content--full"}`}
      >
        {/* Affichage conditionnel des pages */}
        {activePage === "accueil" && <Home onNavigate={setActivePage} />}
        {activePage === "portfolio" && <Portfolio />}
        {activePage === "devis" && <RequestQuote />}
        {activePage === "apropos" && <About />}
        {activePage === "mentions-legales" && <LegalMention />}
        {activePage === "login" && (
          <Login onLoginSuccess={handleLoginSuccess} />
        )}
        {activePage === "atelier" && <Workshop />}

        {/* Rendu conditionnel selon l'authentification */}
        {/* Protection du dashboard :
            token -> Dashboard
            pas de token -> Login */}
        {activePage === "dashboard" &&
          (token ? (
            <Dashboard token={token} onAuthError={handleLogout} />
          ) : (
            <Login onLoginSuccess={handleLoginSuccess} />
          ))}
      </div>
    </div>
  );
}

export default App;
