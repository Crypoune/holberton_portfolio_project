import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Dashboard from "./pages/Dashboard";

function App() {
  const [activePage, setActivePage] = useState("dashboard");

  return (
    <div className="app">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <Header onNavigate={setActivePage} />
      <div className="app__content">
        {activePage === "dashboard" && <Dashboard />}
        {activePage === "portfolio" && (
          <p style={{ padding: "2rem" }}>Portfolio — à venir</p>
        )}
        {activePage === "devis" && (
          <p style={{ padding: "2rem" }}>Demande de devis — à venir</p>
        )}
      </div>
    </div>
  );
}

export default App;
