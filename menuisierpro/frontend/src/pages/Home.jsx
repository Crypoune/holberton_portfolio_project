import WhatsAppButton from "../components/ui/WhatsAppButton";
import heroBackground from "../assets/hero-background.webp";
import cuisine2 from "../assets/portfolio/cuisine2.webp";
import armoire from "../assets/portfolio/armoire.webp";
import dressing2 from "../assets/portfolio/dressing2.webp";
import table from "../assets/portfolio/table.webp";
import fauteuil from "../assets/portfolio/fauteuil.webp";
import bureau from "../assets/portfolio/bureau.webp";
import {
  Hammer,
  ChefHat,
  BookOpen,
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";

const SERVICES = [
  {
    Icon: Hammer,
    title: "Mobilier sur mesure",
    desc: "Bibliothèques, dressings, bureaux, tables — conçus selon vos dimensions exactes.",
  },
  {
    Icon: ChefHat,
    title: "Cuisines équipées",
    desc: "Agencement complet, caissons, façades et plans de travail en bois massif.",
  },
  {
    Icon: BookOpen,
    title: "Agencement & Rénovation",
    desc: "Rénovation de meubles anciens, menuiserie intérieure, escaliers et parquets.",
  },
];

const REALISATIONS = [
  { id: 1, label: "Cuisine sur mesure", img: cuisine2 },
  { id: 2, label: "Armoire sur mesure", img: armoire },
  { id: 3, label: "Bibliothèque ouverte", img: dressing2 },
  { id: 4, label: "Table artisanale", img: table },
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

function Home() {
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
            Cuisines, bibliothèques, mobilier d'intérieur — chaque pièce est
            imaginée et façonnée à la main dans notre atelier à Antananarivo.
          </p>
          <div className="home__hero-actions">
            <WhatsAppButton
              telephone="261340000000"
              message="Bonjour, je souhaite demander un devis."
              label="Demander un devis WhatsApp"
            />
            <button className="home__hero-secondary">
              Voir nos réalisations
            </button>
          </div>
        </div>
      </section>

      <section className="home__services">
        <span className="home__services-tag">NOS SAVOIR-FAIRE</span>
        <div className="home__services-grid">
          {SERVICES.map((s) => (
            <div key={s.title} className="service-card">
              <div className="service-card__icon-wrap">
                <s.Icon size={26} />
              </div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="home__portfolio">
        <span className="home__section-tag">PORTFOLIO</span>
        <h2>Nos réalisations</h2>
        <div className="portfolio-grid">
          {REALISATIONS.map((r) => (
            <div
              key={r.id}
              className="portfolio-card"
              style={{ backgroundImage: `url(${r.img})` }}
            >
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="home__temoignages">
        <span className="home__section-tag">AVIS CLIENTS</span>
        <h2>Ce qu'ils en disent</h2>
        <div className="temoignages-grid">
          {TEMOIGNAGES.map((t) => (
            <div key={t.nom} className="temoignage-card">
              <div className="temoignage-card__stars">
                {Array.from({ length: t.note }).map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p>"{t.texte}"</p>
              <div className="temoignage-card__author">
                <strong>{t.nom}</strong>
                <span>{t.ville}</span>
              </div>
            </div>
          ))}
        </div>
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
        <p className="home__footer-links">
          Antananarivo, Madagascar · WhatsApp · Devis gratuit
        </p>
        <p className="home__footer-copy">
          © 2026 Geppetto's House. Tous droits réservés.
        </p>
      </footer>
    </main>
  );
}

export default Home;
