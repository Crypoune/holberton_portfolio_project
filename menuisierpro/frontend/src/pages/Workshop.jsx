// frontend/src/pages/Atelier.jsx
function Workshop() {
  return (
    <main className="atelier">
      <header className="atelier__hero">
        <span className="atelier__tag">NOTRE HISTOIRE</span>
        <h1>Notre atelier</h1>
        <p className="atelier__subtitle">
          {/* TODO: accroche narrative (1-2 phrases) */}
        </p>
      </header>

      <section className="atelier__section">
        <h2>Notre histoire</h2>
        <p>
          {/* TODO: raconter les origines de l'atelier, l'artisan, sa ville */}
        </p>
      </section>

      <section className="atelier__section atelier__section--reverse">
        <div className="atelier__text">
          <h2>Notre savoir-faire</h2>
          <p>
            {/* TODO: décrire les techniques, les matériaux (bois massif malgache...) */}
          </p>
        </div>
        <div className="atelier__image-placeholder" aria-hidden="true" />
      </section>

      <section className="atelier__values">
        <h2>Nos valeurs</h2>
        <div className="atelier__values-grid">
          {/* TODO: 3-4 cartes de valeurs (ex: sur-mesure, durabilité, transmission) */}
          <div className="atelier__value-card">
            <h3>{/* Titre valeur 1 */}</h3>
            <p>{/* Description */}</p>
          </div>
          <div className="atelier__value-card">
            <h3>{/* Titre valeur 2 */}</h3>
            <p>{/* Description */}</p>
          </div>
          <div className="atelier__value-card">
            <h3>{/* Titre valeur 3 */}</h3>
            <p>{/* Description */}</p>
          </div>
        </div>
      </section>

      <section className="atelier__gallery">
        <h2>L'atelier en images</h2>
        <div className="atelier__gallery-grid">
          {/* TODO: réutiliser des visuels d'atelier/outils, séparés du Portfolio produit */}
        </div>
      </section>
    </main>
  );
}

export default Workshop;
