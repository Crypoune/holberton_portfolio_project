function About() {
  return (
    <main className="page-static">
      <section className="page-static__hero">
        <span className="page-static__tag">NOTRE HISTOIRE</span>
        <h1>À propos de Geppetto's House</h1>
        <p>
          Fondée à Antananarivo, Geppetto's House est un atelier de menuiserie
          artisanale spécialisé dans le mobilier sur mesure. Chaque pièce est
          façonnée à la main, dans le respect du bois local et des techniques
          traditionnelles malgaches.
        </p>
      </section>

      <section className="page-static__section">
        <h2>Notre savoir-faire</h2>
        <p>
          Depuis nos débuts, nous travaillons des essences locales —
          palissandre, eucalyptus, bois de rose — pour créer des meubles
          durables et uniques. Chaque commande est pensée avec le client, du
          premier croquis à la livraison finale.
        </p>
      </section>

      <section className="page-static__section">
        <h2>Nos valeurs</h2>
        <ul className="page-static__list">
          <li>Qualité artisanale, sans compromis</li>
          <li>Matériaux locaux et durables</li>
          <li>Transparence sur les délais et les prix</li>
          <li>Un accompagnement personnalisé, du devis à la livraison</li>
        </ul>
      </section>
    </main>
  );
}

export default About;
