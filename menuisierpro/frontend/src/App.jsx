import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import RequestQuote from "./pages/RequestQuote";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Header onNavigate={setActivePage} />
      <div className="app__content">
        {activePage === "accueil" && <Home onNavigate={setActivePage} />}
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "portfolio" && <Portfolio />}
        {activePage === "devis" && <RequestQuote />}
      </div>
    </div>
  );
}

export default App;
