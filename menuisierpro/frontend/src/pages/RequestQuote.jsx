import { useState } from "react";

const TYPES_MEUBLE = [
  "Table",
  "Chaise",
  "Armoire",
  "Bibliothèque",
  "Cuisine",
  "Dressing",
  "Autre",
];
const MATERIAUX = [
  "Chêne",
  "Pin",
  "Palissandre",
  "Acajou",
  "Autre / je ne sais pas",
];

function RequestQuote() {
  const [form, setForm] = useState({
    nom: "",
    telephone_whatsapp: "",
    email: "",
    type_meuble: "",
    dimensions_approximatives: "",
    materiau: "",
  });
  const [status, setStatus] = useState("idle"); // idle | envoi | succes | erreur

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("envoi");

    try {
      const res = await fetch("/api/v1/quotes/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erreur lors de l'envoi");
      setStatus("succes");
    } catch (err) {
      setStatus("erreur");
    }
  };

  if (status === "succes") {
    return (
      <main className="demande-devis demande-devis--succes">
        <h1>Merci !Ò</h1>
        <p>
          Votre demande de devis a bien été envoyée. Nous vous répondrons sous
          24h sur WhatsApp.
        </p>
      </main>
    );
  }

  return (
    <main className="demande-devis">
      <header className="demande-devis__header">
        <h1>Demander un devis gratuit</h1>
        <p>Parlez-nous de votre projet, on vous répond rapidement</p>
      </header>

      <form className="demande-devis__form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Vos coordonnées</legend>

          <label htmlFor="nom">Nom complet</label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            value={form.nom}
            onChange={handleChange}
          />

          <label htmlFor="telephone_whatsapp">Numéro WhatsApp</label>
          <input
            id="telephone_whatsapp"
            name="telephone_whatsapp"
            type="tel"
            placeholder="261340001234"
            required
            value={form.telephone_whatsapp}
            onChange={handleChange}
          />

          <label htmlFor="email">Email (optionnel)</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
          />
        </fieldset>

        <fieldset>
          <legend>Votre projet</legend>

          <label htmlFor="type_meuble">Type de meuble</label>
          <select
            id="type_meuble"
            name="type_meuble"
            required
            value={form.type_meuble}
            onChange={handleChange}
          >
            <option value="">Choisissez...</option>
            {TYPES_MEUBLE.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label htmlFor="dimensions_approximatives">
            Dimensions approximatives
          </label>
          <input
            id="dimensions_approximatives"
            name="dimensions_approximatives"
            type="text"
            placeholder="ex : 2m x 1m"
            value={form.dimensions_approximatives}
            onChange={handleChange}
          />

          <label htmlFor="materiau">Matériau souhaité</label>
          <select
            id="materiau"
            name="materiau"
            value={form.materiau}
            onChange={handleChange}
          >
            <option value="">Choisissez...</option>
            {MATERIAUX.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </fieldset>

        {status === "erreur" && (
          <p className="demande-devis__error">
            Une erreur est survenue, réessayez.
          </p>
        )}

        <button
          type="submit"
          className="demande-devis__submit"
          disabled={status === "envoi"}
        >
          {status === "envoi" ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </form>
    </main>
  );
}

export default RequestQuote;
