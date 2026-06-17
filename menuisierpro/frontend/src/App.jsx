import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Accueil from "./pages/Accueil";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import DemandeDevis from "./pages/DemandeDevis";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Header onNavigate={setActivePage} />
      <div className="app__content">
        {activePage === "accueil" && <Accueil onNavigate={setActivePage} />}
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "portfolio" && <Portfolio />}
        {activePage === "devis" && <DemandeDevis />}
      </div>
    </div>
  );
}

export default App;
