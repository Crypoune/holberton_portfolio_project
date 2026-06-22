import WhatsAppButton from "../components/ui/WhatsAppButton";
import { Hammer, ChefHat, BookOpen, Star } from "lucide-react";

const SERVICES = [
  {
    Icon: Hammer,
    title: "Meubles sur mesure",
    desc: "Tables, chaises, bancs personnalisés. Adaptés à vos besoins et votre espace.",
  },
  {
    Icon: ChefHat,
    title: "Cuisines & Rangements",
    desc: "Aménagements cuisine complets. Solutions de rangement optimisées.",
  },
  {
    Icon: BookOpen,
    title: "Bibliothèques & Dressings",
    desc: "Bibliothèques murales et sur mesure. Dressings et placards personnalisés.",
  },
];

const REALISATIONS = [
  {
    id: 1,
    label: "Table en palissandre",
    img: "https://picsum.photos/seed/table1/400/300",
  },
  {
    id: 2,
    label: "Armoire sur mesure",
    img: "https://picsum.photos/seed/armoire1/400/300",
  },
  {
    id: 3,
    label: "Bibliothèque moderne",
    img: "https://picsum.photos/seed/biblio1/400/300",
  },
  {
    id: 4,
    label: "Cuisine intégrée",
    img: "https://picsum.photos/seed/cuisine1/400/300",
  },
  {
    id: 5,
    label: "Dressing personnalisé",
    img: "https://picsum.photos/seed/dressing1/400/300",
  },
  {
    id: 6,
    label: "Table basse artisanale",
    img: "https://picsum.photos/seed/tablebasse1/400/300",
  },
];

const TEMOIGNAGES = [
  {
    nom: "Ravo Rakotoarison",
    note: 5,
    texte:
      "Travail impeccable et finitions soignées. La table que j'ai commandée est magnifique et exactement ce que je voulais. Je recommande vivement !",
  },
  {
    nom: "Sophie Andriamampianina",
    note: 5,
    texte:
      "Excellent service du début à la fin. L'équipe a su comprendre mes besoins et proposer des solutions adaptées. Ma cuisine est superbe !",
  },
  {
    nom: "Jean-Claude Rasolofo",
    note: 5,
    texte:
      "Très professionnel et à l'écoute. Le dressing réalisé est de très bonne qualité. Livraison dans les temps. Merci beaucoup !",
  },
];

function Accueil({ onNavigate }) {
  return (
    <main className="accueil">
      <section className="accueil__hero">
        <h1>Du bois sur mesure, fait avec passion</h1>
        <p className="accueil__hero-subtitle">
          Meubles artisanaux fabriqués à Madagascar
        </p>
        <WhatsAppButton
          telephone="261340000000"
          message="Bonjour, je souhaite demander un devis."
          label="Demander un devis gratuit"
        />
        <p className="accueil__hero-trust">
          Réponse sous 24h · Devis gratuit · Livraison Madagascar
        </p>
      </section>

      <section className="accueil__services">
        {SERVICES.map((s) => (
          <div key={s.title} className="service-card">
            <s.Icon className="service-card__icon" size={28} />
            <h3>{s.title}</h3>
            <p>{s.desc}</p>
          </div>
        ))}
      </section>

      <section className="accueil__realisations">
        <h2>Nos réalisations</h2>
        <div className="realisations-grid">
          {REALISATIONS.map((r) => (
            <div key={r.id} className="realisation-card">
              <img src={r.img} alt={r.label} />
              <p>{r.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="accueil__temoignages">
        <h2>Ce que disent nos clients</h2>
        <div className="temoignages-list">
          {TEMOIGNAGES.map((t) => (
            <div key={t.nom} className="temoignage-card">
              <h4>{t.nom}</h4>
              <div className="temoignage-card__stars">
                {Array.from({ length: t.note }).map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              <p>"{t.texte}"</p>
            </div>
          ))}
        </div>
      </section>

      <section className="accueil__cta">
        <h2>Vous avez un projet ?</h2>
        <WhatsAppButton
          telephone="261340000000"
          message="Bonjour, j'aimerais discuter d'un projet."
          label="Nous contacter sur WhatsApp"
        />
        <p className="accueil__cta-sub">Ou appelez-nous directement</p>
      </section>

      <footer className="accueil__footer">
        <p>Geppetto's House · Menuiserie à Madagascar</p>
        <p className="accueil__footer-copy">© 2026 Tous droits réservés</p>
      </footer>
    </main>
  );
}

export default Accueil;
