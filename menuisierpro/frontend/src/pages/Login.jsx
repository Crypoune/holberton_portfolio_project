import { useState } from "react";

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/v1/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Identifiants incorrects");
      }

      // Si Django valide, il nous donne le badge (data.token)
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="demande-devis">
      <header className="demande-devis__header">
        <h1>Espace Artisan</h1>
        <p>Connectez-vous pour accéder au carnet de commandes</p>
      </header>

      <form className="demande-devis__form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Connexion sécurisée</legend>

          <label htmlFor="username">Nom d'utilisateur</label>
          <input
            id="username"
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </fieldset>

        {error && <p className="demande-devis__error">{error}</p>}

        <button type="submit" className="demande-devis__submit" disabled={loading}>
          {loading ? "Vérification..." : "Se connecter"}
        </button>

      </form>
    </main>
  );
}

export default Login;