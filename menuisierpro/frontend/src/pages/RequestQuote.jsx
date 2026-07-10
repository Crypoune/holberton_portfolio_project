import { useState, useEffect } from "react";

const TYPES_TRAVAUX = [
  "Rénovation (remplacement)",
  "Neuf (construction)",
];

const TYPES_PRODUIT = [
  "Fenêtres / Portes-fenêtres",
  "Porte d'entrée",
  "Volets (Roulants, Battants)",
  "Porte de garage",
  "Portail / Clôture",
  "Menuiserie intérieure (Escalier, Dressing, Portes)",
  "Aménagement extérieur (Terrasse, Pergola)",
];

const MATERIAUX = [
  "Chêne",
  "Pin",
  "Palissandre",
  "Acajou",
  "Autre / je ne sais pas",
];

const DELAIS = [
  "Urgent (Moins d'un mois)",
  "Sous 3 mois",
  "D'ici 6 mois ou plus",
  "Simple estimation budgétaire",
];

const BUDGETS = [
  "Moins de 2 000 €",
  "Entre 2 000 € et 5 000 €",
  "Entre 5 000 € et 10 000 €",
  "Plus de 10 000 €",
];

function RequestQuote() {
  const [form, setForm] = useState({
    nom: "Rakoto Michel",
    telephone_whatsapp: "+261340001234",
    email: "michel@gmail.com",
    code_postal: "",
    ville: "",
    type_client: "Particulier",
    type_travaux: "",
    type_produit: "",
    dimensions_approximatives: "",
    quantite: 1,
    materiau: "",
    description: "",
    delai: "",
    budget: "",
    photo_plan: null,
  });

  const [status, setStatus] = useState("idle"); // idle | envoi | succes | erreur
  const [validationError, setValidationError] = useState("");
  const [cooldownRemaining, setCooldownRemaining] = useState(0);
  const [isDragActive, setIsDragActive] = useState(false);

  // Vérifier la limitation de débit (15 minutes de cooldown après soumission réussie)
  useEffect(() => {
    const checkCooldown = () => {
      const lastSubmit = localStorage.getItem("last_quote_submitted_at");
      if (lastSubmit) {
        const elapsedMs = Date.now() - parseInt(lastSubmit, 10);
        const cooldownMs = 15 * 60 * 1000;
        if (elapsedMs < cooldownMs) {
          const remainingSec = Math.ceil((cooldownMs - elapsedMs) / 1000);
          setCooldownRemaining(remainingSec);
        } else {
          setCooldownRemaining(0);
        }
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [status]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setValidationError("");
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setForm({ ...form, photo_plan: e.dataTransfer.files[0] });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, photo_plan: e.target.files[0] });
    }
  };

  const validateForm = () => {
    // 1. Validation du Nom complet
    if (!/^[a-zA-ZÀ-ÿ\s-']{3,100}$/.test(form.nom.trim())) {
      setValidationError("Le nom doit comporter entre 3 et 100 caractères (lettres et espaces uniquement).");
      return false;
    }

    // 2. Validation de l'Email (optionnel)
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setValidationError("Le format de l'adresse e-mail n'est pas valide.");
      return false;
    }

    // 3. Validation du téléphone WhatsApp
    const telClean = form.telephone_whatsapp.replace(/[\s-()]/g, "");
    if (!telClean) {
      setValidationError("Le numéro WhatsApp est obligatoire.");
      return false;
    }

    if (!telClean.startsWith("+")) {
      setValidationError("Le numéro doit commencer par '+' suivi du code pays (ex: +261 pour Madagascar, +33 pour la France).");
      return false;
    }

    if (telClean.startsWith("+261")) {
      const local = telClean.slice(4);
      if (!/^3[23489]\d{7}$/.test(local)) {
        setValidationError("Pour Madagascar, le numéro après +261 doit comporter 9 chiffres et commencer par 32, 33, 34, 38 ou 39.");
        return false;
      }
    } else if (telClean.startsWith("+33")) {
      const local = telClean.slice(3);
      if (!/^[1-9]\d{8}$/.test(local)) {
        setValidationError("Pour la France, le numéro après +33 doit comporter 9 chiffres (sans le 0 initial).");
        return false;
      }
    } else if (telClean.startsWith("+262")) {
      const local = telClean.slice(4);
      if (!/^[1-9]\d{8}$/.test(local)) {
        setValidationError("Pour la Réunion ou Mayotte, le numéro après +262 doit comporter 9 chiffres.");
        return false;
      }
    } else {
      if (!/^\+[1-9]\d{7,14}$/.test(telClean)) {
        setValidationError("Le format du numéro de téléphone international est invalide.");
        return false;
      }
    }

    // 4. Validation Code Postal et Ville
    if (!form.code_postal.trim()) {
      setValidationError("Le code postal est indispensable.");
      return false;
    }

    if (!form.ville.trim()) {
      setValidationError("La ville est indispensable.");
      return false;
    }

    // 5. Validation des nouveaux menus
    if (!form.type_travaux) {
      setValidationError("Veuillez sélectionner le type de travaux.");
      return false;
    }

    if (!form.type_produit) {
      setValidationError("Veuillez sélectionner le type de produit principal.");
      return false;
    }

    if (!form.dimensions_approximatives.trim()) {
      setValidationError("Veuillez indiquer des dimensions approximatives.");
      return false;
    }

    if (!form.delai) {
      setValidationError("Veuillez sélectionner le délai souhaité.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationError("");

    if (cooldownRemaining > 0) {
      setValidationError(`Veuillez patienter encore ${formatTime(cooldownRemaining)} avant de faire une nouvelle demande.`);
      return;
    }

    if (!validateForm()) return;

    setStatus("envoi");

    const telClean = form.telephone_whatsapp.replace(/[\s-()]/g, "");
    
    // Utiliser FormData pour l'envoi de fichier
    const formData = new FormData();
    formData.append("nom", form.nom.trim());
    formData.append("telephone_whatsapp", telClean);
    formData.append("email", form.email.trim());
    formData.append("code_postal", form.code_postal.trim());
    formData.append("ville", form.ville.trim());
    formData.append("type_client", form.type_client);
    formData.append("type_travaux", form.type_travaux);
    formData.append("type_produit", form.type_produit);
    formData.append("type_meuble", form.type_produit); // Compatibilité type_meuble requis dans l'ancien modèle
    formData.append("dimensions_approximatives", form.dimensions_approximatives.trim());
    formData.append("quantite", form.quantite);
    formData.append("materiau", form.materiau);
    formData.append("description", form.description.trim());
    formData.append("delai", form.delai);
    formData.append("budget", form.budget);
    if (form.photo_plan) {
      formData.append("photo_plan", form.photo_plan);
    }

    try {
      const res = await fetch("/api/v1/devis/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de l'envoi du devis");
      }

      // eslint-disable-next-line react-hooks/purity
      localStorage.setItem("last_quote_submitted_at", Date.now().toString());
      setStatus("succes");
    } catch (err) {
      setValidationError(err.message || "Une erreur est survenue, réessayez.");
      setStatus("erreur");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (status === "succes") {
    return (
      <main className="request-quote request-quote--succes">
        <h1>Merci !</h1>
        <p>
          Votre demande de devis a bien été envoyée. Nous vous répondrons sous
          24h sur WhatsApp.
        </p>
      </main>
    );
  }

  return (
    <main className="request-quote">
      <header className="request-quote__header">
        <h1>Demander un devis gratuit</h1>
        <p>Parlez-nous de votre projet, on vous répond rapidement</p>
      </header>

      {cooldownRemaining > 0 && (
        <div className="request-quote__error" style={{ marginBottom: "1.5rem" }}>
          Vous avez récemment soumis une demande. Veuillez patienter{" "}
          <strong>{formatTime(cooldownRemaining)}</strong> avant d'effectuer une nouvelle estimation.
        </div>
      )}
      <form className="request-quote__form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Vos coordonnées</legend>

          <label htmlFor="nom">Nom complet *</label>
          <input
            id="nom"
            name="nom"
            type="text"
            required
            pattern="^[a-zA-ZÀ-ÿ\s-']{3,100}$"
            title="Le nom doit comporter entre 3 et 100 caractères (lettres et espaces uniquement)"
            placeholder="Ex: Rakoto Michel"
            value={form.nom}
            onChange={handleChange}
          />

          <label htmlFor="telephone_whatsapp">Numéro WhatsApp (Format: +261...) *</label>
          <input
            id="telephone_whatsapp"
            name="telephone_whatsapp"
            type="tel"
            placeholder="Ex: +261340001234"
            required
            value={form.telephone_whatsapp}
            onChange={handleChange}
          />
          <small style={{ color: "#6b7280", fontSize: "0.75rem", display: "block", marginTop: "-0.25rem", marginBottom: "0.5rem" }}>
            Le numéro doit commencer par '+' suivi du code pays.
          </small>

          <label htmlFor="email">Email (optionnel)</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Ex: michel@gmail.com"
            value={form.email}
            onChange={handleChange}
          />

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <div style={{ flex: 1 }}>
              <label htmlFor="code_postal">Code Postal *</label>
              <input
                id="code_postal"
                name="code_postal"
                type="text"
                required
                placeholder="Ex: 101"
                value={form.code_postal}
                onChange={handleChange}
              />
            </div>
            <div style={{ flex: 2 }}>
              <label htmlFor="ville">Ville / Localité *</label>
              <input
                id="ville"
                name="ville"
                type="text"
                required
                placeholder="Ex: Antananarivo"
                value={form.ville}
                onChange={handleChange}
              />
            </div>
          </div>

          <label style={{ marginTop: "1rem" }}>Type de client *</label>
          <div style={{ display: "flex", gap: "1.5rem", marginTop: "0.25rem" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: "normal" }}>
              <input
                type="radio"
                name="type_client"
                value="Particulier"
                checked={form.type_client === "Particulier"}
                onChange={handleChange}
                style={{ width: "auto", margin: 0 }}
              />
              Particulier
            </label>
            <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontWeight: "normal" }}>
              <input
                type="radio"
                name="type_client"
                value="Professionnel / Architecte / Promoteur"
                checked={form.type_client === "Professionnel / Architecte / Promoteur"}
                onChange={handleChange}
                style={{ width: "auto", margin: 0 }}
              />
              Professionnel / Architecte / Promoteur
            </label>
          </div>
        </fieldset>

        <fieldset>
          <legend>Votre projet</legend>

          <label htmlFor="type_travaux">Type de travaux *</label>
          <select
            id="type_travaux"
            name="type_travaux"
            required
            value={form.type_travaux}
            onChange={handleChange}
          >
            <option value="">Choisissez...</option>
            {TYPES_TRAVAUX.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label htmlFor="type_produit">Type de produit principal *</label>
          <select
            id="type_produit"
            name="type_produit"
            required
            value={form.type_produit}
            onChange={handleChange}
          >
            <option value="">Choisissez...</option>
            {TYPES_PRODUIT.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          <label htmlFor="dimensions_approximatives">
            Dimensions approximatives (Hauteur x Largeur en cm) *
          </label>
          <input
            id="dimensions_approximatives"
            name="dimensions_approximatives"
            type="text"
            required
            placeholder="ex : 120 x 80 cm"
            value={form.dimensions_approximatives}
            onChange={handleChange}
          />
          <small style={{ color: "#6b7280", fontSize: "0.75rem", display: "block", marginTop: "-0.25rem", marginBottom: "0.5rem" }}>
            Ne vous inquiétez pas, un technicien viendra valider les mesures exactes.
          </small>

          <label htmlFor="quantite">Nombre d'unités / Quantité *</label>
          <input
            id="quantite"
            name="quantite"
            type="number"
            required
            min="1"
            value={form.quantite}
            onChange={handleChange}
            style={{ width: "120px" }}
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

          <label htmlFor="description">Description libre du projet</label>
          <textarea
            id="description"
            name="description"
            rows={4}
            placeholder="Précisez ici vos attentes : double/triple vitrage, couleur spécifique, contraintes architecturales..."
            value={form.description}
            onChange={handleChange}
            style={{
              padding: "0.625rem 0.75rem",
              border: "1px solid #d1d5db",
              borderRadius: "0.5rem",
              fontSize: "0.9rem",
              fontFamily: "inherit",
              resize: "vertical",
            }}
          />
        </fieldset>

        <fieldset>
          <legend>Contexte du projet</legend>

          <label htmlFor="delai">Délai souhaité pour la réalisation *</label>
          <select
            id="delai"
            name="delai"
            required
            value={form.delai}
            onChange={handleChange}
          >
            <option value="">Choisissez...</option>
            {DELAIS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          <label htmlFor="budget">Budget estimé (Optionnel)</label>
          <select
            id="budget"
            name="budget"
            value={form.budget}
            onChange={handleChange}
          >
            <option value="">Choisissez...</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <label>Ajout de photos / plans</label>
          <div
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("photo_plan_input").click()}
            style={{
              border: isDragActive ? "2px dashed #4b5563" : "2px dashed #d1d5db",
              borderRadius: "0.5rem",
              padding: "2rem",
              textAlign: "center",
              background: isDragActive ? "#f3f4f6" : "#fafafa",
              cursor: "pointer",
              transition: "all 0.2s ease-in-out",
            }}
          >
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ marginBottom: "0.5rem" }}
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p style={{ margin: 0, fontSize: "0.875rem", color: "#4b5563", fontWeight: "bold" }}>
              Glissez-déposez vos fichiers ici ou cliquez pour choisir
            </p>
            <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.75rem", color: "#9ca3af" }}>
              Formats acceptés : PDF, PNG, JPG, JPEG
            </p>
            {form.photo_plan && (
              <p style={{ margin: "0.5rem 0 0 0", fontSize: "0.875rem", color: "#10b981", fontWeight: "bold" }}>
                Fichier sélectionné : {form.photo_plan.name}
              </p>
            )}
            <input
              id="photo_plan_input"
              name="photo_plan"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              accept=".pdf,image/*"
            />
          </div>
          <small style={{ color: "#6b7280", fontSize: "0.75rem", display: "block", marginTop: "0.5rem" }}>
            Conseil de pro : Permettre l'envoi de photos de l'existant ou de plans d'architecte fait gagner un temps précieux à l'atelier.
          </small>
        </fieldset>

        {validationError && (
          <p className="request-quote__error">
            {validationError}
          </p>
        )}

        {status === "erreur" && (
          <p className="request-quote__error">
            Une erreur est survenue, réessayez.
          </p>
        )}

        <button
          type="submit"
          className="request-quote__submit"
<<<<<<< HEAD
          disabled={status === "envoi" || cooldownRemaining > 0}
=======
          disabled={status === "envoi"}
>>>>>>> origin/jason
        >
          {status === "envoi" ? "Envoi en cours..." : "Envoyer ma demande"}
        </button>
      </form>
    </main>
  );
}

export default RequestQuote;
