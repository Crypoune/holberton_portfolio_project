import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Portfolio from "./pages/Portfolio";
import RequestQuote from "./pages/RequestQuote";
import Login from "./pages/Login";

function App() {
  const [activePage, setActivePage] = useState("accueil");
  const [token, setToken] = useState(localStorage.getItem("token"));
  //const [token, setToken] = useState("fake-token-visual-testing");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setActivePage("accueil");
  };

  return (
    <div className="app">
      <Sidebar
        activePage={activePage}
        onNavigate={setActivePage}
        isConnected={!!token}
        onLogout={handleLogout}
      />
      <Header onNavigate={setActivePage} isConnected={!!token} />

      <div className="app__content">
        {activePage === "accueil" && <Home onNavigate={setActivePage} />}
        {activePage === "dashboard" &&
          (token ? (
            <Dashboard token={token} />
          ) : (
            <Login onNavigate={setActivePage} onLogin={setToken} />
          ))}
        {activePage === "portfolio" && <Portfolio />}
        {activePage === "devis" && <RequestQuote />}
        {activePage === "login" && (
          <Login onNavigate={setActivePage} onLogin={setToken} />
        )}
      </div>
    </div>
  );
}

export default App;
