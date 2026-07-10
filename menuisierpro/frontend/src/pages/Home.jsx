import WhatsAppButton from "../components/ui/WhatsAppButton";
import Marquee from "../components/ui/Marquee";
import heroBackground from "../assets/hero-background.webp";
import banc from "../assets/portfolio/banc.webp";
import armoire from "../assets/portfolio/armoire.webp";
import dressing2 from "../assets/portfolio/dressing2.webp";
import table from "../assets/portfolio/table.webp";
import fauteuil from "../assets/portfolio/fauteuil.webp";
import bureau from "../assets/portfolio/bureau.webp";
import { Star, CheckCircle, MapPin, Clock, Phone } from "lucide-react";

const REALISATIONS = [
  { id: 1, label: "Chaises et table artisanale", img: table },
  { id: 2, label: "Armoire sur mesure", img: armoire },
  { id: 3, label: "Bibliothèque ouverte", img: dressing2 },
  { id: 4, label: "Banc en bois", img: banc },
  { id: 5, label: "Fauteuil en bois", img: fauteuil },
  { id: 6, label: "Bureau sur mesure", img: bureau },
];

const TEMOIGNAGES = [
  {
    nom: "Hery Rakotomalala",
    ville: "Antananarivo",
    note: 5,
    texte:
      "Geppetto's House a transformé notre cuisine en chef-d'œuvre. Le soin du détail et la qualité du bois sont exceptionnels. Nous recommandons chaleureusement.",
  },
  {
    nom: "Marie-Claire Randria",
    ville: "Fianarantsoa",
    note: 5,
    texte:
      "Des meubles livrés dans les délais, avec un fini impeccable. L'équipe est à l'écoute et de bon conseil. Notre bibliothèque est la pièce maîtresse du salon.",
  },
  {
    nom: "Tsiry Andriamahefa",
    ville: "Toamasina",
    note: 5,
    texte:
      "Devis rapide, prix juste, travail soigné. Je suis bluffé par la précision des assemblages. Ce sont de vrais artisans du bois à Madagascar.",
  },
];

const TRUST = [
  {
    Icon: CheckCircle,
    value: "+50 réalisations",
    label: "livrées depuis 2010",
  },
  { Icon: MapPin, value: "Madagascar", label: "atelier à Antananarivo" },
  { Icon: Clock, value: "Devis sous 24h", label: "réponse garantie" },
  { Icon: Phone, value: "Suivi personnalisé", label: "de A à Z" },
];

function Home({ onNavigate }) {
  return (
    <main className="home">
      <section
        className="home__hero"
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
        <div className="home__hero-overlay" />
        <div className="home__hero-content">
          <span className="home__hero-tag">ARTISAN MENUISIER DEPUIS 2010</span>
          <h1>Du bois sur mesure, fait avec passion.</h1>
          <p>
            Bibliothèques, mobilier d'intérieur — chaque pièce est imaginée et
            façonnée à la main dans notre atelier à Antananarivo.
          </p>
          <div className="home__hero-actions">
            <WhatsAppButton
              telephone="261340000000"
              message="Bonjour, je souhaite demander un devis."
              label="Demander un devis WhatsApp"
            />
            <button
              className="home__hero-secondary"
              onClick={() => onNavigate("portfolio")}
            >
              Voir nos réalisations
            </button>
          </div>
        </div>
      </section>

      <section className="home__portfolio">
        <span className="home__section-tag">PORTFOLIO</span>
        <h2>Nos réalisations</h2>
        <Marquee
          items={REALISATIONS}
          speed={35}
          renderItem={(r) => (
            <div
              className="portfolio-card"
              style={{ backgroundImage: `url(${r.img})` }}
            >
              <span>{r.label}</span>
            </div>
          )}
        />
      </section>

      <section className="home__feedbacks">
        <span className="home__section-tag">AVIS CLIENTS</span>
        <h2>Ce qu'ils en disent</h2>
        <Marquee
          items={TEMOIGNAGES}
          speed={40}
          renderItem={(t) => (
            <div className="feedback-card">
              <div className="feedback-card__stars">
                {Array.from({ length: t.note }).map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p>"{t.texte}"</p>
              <div className="feedback-card__author">
                <strong>{t.nom}</strong>
                <span>{t.ville}</span>
              </div>
            </div>
          )}
        />
      </section>

      <section className="home__trust">
        <h2>Ils nous font confiance</h2>
        <div className="trust-grid">
          {TRUST.map((t) => (
            <div key={t.value} className="trust-item">
              <t.Icon size={22} />
              <strong>{t.value}</strong>
              <span>{t.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home__cta">
        <span className="home__section-tag">PRÊT À DÉMARRER ?</span>
        <h2>Votre projet mérite un artisan de confiance.</h2>
        <p>
          Partagez vos idées — dimensions, matériaux, budget — et recevez un
          devis personnalisé sous 24 heures, directement sur WhatsApp.
        </p>
        <WhatsAppButton
          telephone="261340000000"
          message="Bonjour, j'aimerais discuter d'un projet."
          label="Nous contacter sur WhatsApp"
        />
      </section>

      <footer className="home__footer">
        <strong>GEPPETTO'S HOUSE</strong>
        <span className="home__footer-subtitle">MENUISERIE · MADAGASCAR</span>

        <nav className="home__footer-links">
          <button onClick={() => onNavigate("devis")}>Demander un devis</button>
          <a
            href="https://wa.me/261340000000?text=Bonjour%2C%20j%27aimerais%20discuter%20d%27un%20projet."
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp
          </a>
          <button onClick={() => onNavigate("apropos")}>À propos</button>
          <button onClick={() => onNavigate("mentions-legales")}>
            Mentions légales
          </button>
        </nav>

        <p className="home__footer-copy">
          © 2026 Geppetto's House. Tous droits réservés.
        </p>
      </footer>
    </main>
  );
}

export default Home;
