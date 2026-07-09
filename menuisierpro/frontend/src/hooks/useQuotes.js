import { useState, useEffect } from "react";

const DEFAULT_FILTERS = {
  materiau: "",
  type_meuble: "",
  statut: "",
  ordering: "-date_creation",
};

function useQuotes(token, filters = DEFAULT_FILTERS) {
  const [quotes, setQuotes] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [stats, setStats] = useState({ total: 0, enAttente: 0, acceptes: 0, aRelancer: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    const headers = {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };

    // On ne garde que les filtres non vides dans l'URL
    const params = new URLSearchParams();
    if (filters.materiau)    params.set("materiau", filters.materiau);
    if (filters.type_meuble) params.set("type_meuble", filters.type_meuble);
    if (filters.statut)      params.set("statut", filters.statut);
    params.set("ordering", filters.ordering || "-date_creation");

    Promise.all([
      fetch(`/api/v1/devis/?${params.toString()}`, { headers }).then((res) => {
        if (!res.ok) throw new Error(`Erreur devis (${res.status})`);
        return res.json();
      }),
      fetch("/api/v1/dashboard/stats/", { headers }).then((res) => {
        if (!res.ok) throw new Error(`Erreur statistiques (${res.status})`);
        return res.json();
      }),
    ])
      .then(([devisPage, statsData]) => {
        if (cancelled) return;

        setQuotes(Array.isArray(devisPage.results) ? devisPage.results : devisPage);

        setStats({
          total: statsData.devis.total,
          enAttente: statsData.devis.en_attente,
          acceptes: statsData.devis.acceptes,
          aRelancer: statsData.devis.a_relancer,
        });

        setRecentClients(statsData.dernieres_inscriptions || []);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Erreur de récupération du dashboard :", err);
        setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [token, filters.materiau, filters.type_meuble, filters.statut, filters.ordering]);

  return { quotes, stats, recentClients, loading, error };
}

export default useQuotes;
export { DEFAULT_FILTERS };