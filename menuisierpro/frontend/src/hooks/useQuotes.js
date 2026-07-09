import { useState, useEffect } from "react";

function useQuotes(token) {
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

    Promise.all([
      fetch("/api/v1/devis/", { headers }).then((res) => {
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

        // La liste est paginée (DEFAULT_PAGINATION_CLASS) : résultats dans .results
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

    return () => {
      cancelled = true;
    };
  }, [token]);

  return { quotes, stats, recentClients, loading, error };
}

export default useQuotes;