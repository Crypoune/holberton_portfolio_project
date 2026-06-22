import { useState, useEffect } from "react";

const MOCK_DEVIS = [
  {
    id: 1,
    client: { nom: "Rakoto Michel", telephone_whatsapp: "261340001234" },
    type_meuble: "Table en palissandre",
    statut: "en_attente",
    date_creation: "2026-06-10T08:00:00Z",
    date_relance_j3: null,
    date_relance_j7: null,
    message_whatsapp_genere: "",
  },
  {
    id: 2,
    client: { nom: "Rasoamanana Hanta", telephone_whatsapp: "261340005678" },
    type_meuble: "Armoire sur mesure",
    statut: "relance_j3",
    date_creation: "2026-06-07T08:00:00Z",
    date_relance_j3: "2026-06-10T08:00:00Z",
    date_relance_j7: null,
    message_whatsapp_genere: "",
  },
  {
    id: 3,
    client: { nom: "Andrianaivo Jean", telephone_whatsapp: "261340009876" },
    type_meuble: "Bibliothèque murale",
    statut: "converti",
    date_creation: "2026-06-05T08:00:00Z",
    date_relance_j3: "2026-06-08T08:00:00Z",
    date_relance_j7: null,
    message_whatsapp_genere: "",
  },
  {
    id: 4,
    client: { nom: "Razafy Sophie", telephone_whatsapp: "261340004321" },
    type_meuble: "Chaises en bois massif",
    statut: "en_attente",
    date_creation: "2026-06-13T08:00:00Z",
    date_relance_j3: null,
    date_relance_j7: null,
    message_whatsapp_genere: "",
  },
];

function useQuotes() {
  const [quotes, setQuotes] = useState(MOCK_DEVIS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stats = {
    total: quotes.length,
    enAttente: quotes.filter((q) => q.statut === "en_attente").length,
    acceptes: quotes.filter((q) => q.statut === "converti").length,
    aRelancer: quotes.filter(
      (q) => q.statut === "relance_j3" || q.statut === "relance_j7",
    ).length,
  };

  return { quotes, stats, loading, error };
}

export default useQuotes;
