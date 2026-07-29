import { useState } from "react";
import { Lock } from "lucide-react";

function Login({ onLoginSuccess }) {
  // Pré-rempli uniquement pour la démo. À supprimer en production (useState("")).
  const [username, setUsername] = useState("artisan_boss");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Soumission du formulaire de connexion.
  // async car on attend la réponse du backend avec await.
  // e = event React déclenché par la soumission du formulaire (preventDefault).
  const handleSubmit = async (e) => {
    // Empêche le rechargement automatique de la page.
    e.preventDefault();

    // Nettoyage d'une ancienne erreur + activation du chargement.
    setError("");
    setLoading(true);

    try {
      // Envoi des identifiants à Django REST Framework.
      // Django vérifie l'utilisateur et renvoie un token.
      const res = await fetch("/api/v1/auth/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      // Conversion de la réponse HTTP en objet JavaScript.
      const data = await res.json();

      // Si Django refuse la connexion, on affiche une erreur.
      if (!res.ok) {
        throw new Error(data.error || "Identifiants incorrects");
      }

      // Le token est transmis au composant parent App.jsx.
      // App.jsx gère ensuite le stockage et la redirection vers le dashboard.
      onLoginSuccess(data.token);
    } catch (err) {
      // Affichage d'une erreur utilisateur.
      setError(err.message);
    } finally {
      // Désactivation du mode chargement dans tous les cas.
      setLoading(false);
    }
  };

  return (
    // Réutilisation du SCSS de RequestQuote pour éviter la duplication.
    <main className="request-quote">
      <header className="request-quote__header">
        {/* Style inline acceptable car utilisé une seule fois. */}
        <div
          className="request-quote__icon"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            background: "#fef3c7",
            color: "#d97706",
            margin: "0 auto 1rem",
          }}
        >
          <Lock size={24} />
        </div>
        <h1>Espace Artisan</h1>
        <p>Connectez-vous pour accéder au carnet de commandes</p>
      </header>

      <form className="request-quote__form" onSubmit={handleSubmit}>
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

        {error && <p className="request-quote__error">{error}</p>}

        <button
          type="submit"
          className="request-quote__submit"
          // Désactive le bouton pendant l'appel API pour éviter plusieurs requêtes.
          disabled={loading}
        >
          {loading ? "Vérification..." : "Se connecter"}
        </button>
      </form>
    </main>
  );
}

export default Login;
