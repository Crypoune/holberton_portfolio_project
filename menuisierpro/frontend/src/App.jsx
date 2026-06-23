import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import RequestQuote from "./pages/RequestQuote";
import Login from "./pages/Login"; // Notre nouvelle pièce !

function App() {
  // 1. L'application démarre l'Accueil public
  const [activePage, setActivePage] = useState("accueil");
  
  // 2. On vérifie si un badge (token) est déjà enregistré dans le navigateur
  const [token, setToken] = useState(localStorage.getItem("artisan_token"));

  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("artisan_token", newToken); // On range le badge dans la poche
    setToken(newToken);
    setActivePage("dashboard"); // On ouvre la porte du tableau de bord
  };

  const handleLogout = () => {
    localStorage.removeItem("artisan_token"); // On jette le badge
    setToken(null);
    setActivePage("accueil"); // Retour à la boutique publique
  };

  return (
    <div className="app">
      {/* On passe l'état de connexion aux barres de navigation */}
      <Sidebar 
        activePage={activePage} 
        onNavigate={setActivePage} 
        isConnected={!!token} 
        onLogout={handleLogout} 
      />
      <Header 
        onNavigate={setActivePage} 
        isConnected={!!token} 
      />
      
      <div className="app__content">
        {activePage === "accueil" && <Home onNavigate={setActivePage} />}
        {activePage === "portfolio" && <Portfolio />}
        {activePage === "devis" && <RequestQuote />}
        {activePage === "login" && <Login onLoginSuccess={handleLoginSuccess} />}
        
        {/* LE SAS DE SÉCURITÉ : Si l'utilisateur force l'affichage du dashboard sans token, on lui montre le login */}
        {activePage === "dashboard" && (
          token ? <Dashboard token={token} /> : <Login onLoginSuccess={handleLoginSuccess} />
        )}
      </div>
    </div>
  );
}

export default App;