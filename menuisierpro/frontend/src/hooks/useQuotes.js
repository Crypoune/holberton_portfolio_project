import { useState, useEffect, useCallback } from "react";

const DEFAULT_FILTERS = {
  materiau: "",
  type_meuble: "",
  statut: "",
  ordering: "-date_creation",
};

function useQuotes(token, filters = DEFAULT_FILTERS, onAuthError) {
  const [quotes, setQuotes] = useState([]);
  const [recentClients, setRecentClients] = useState([]);
  const [stats, setStats] = useState({ total: 0, enAttente: 0, acceptes: 0, aRelancer: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleResponse = useCallback((res) => {
    if (res.status === 401 || res.status === 403) {
      onAuthError?.();
      throw new Error("Session invalide ou droits insuffisants.");
    }
    if (!res.ok) throw new Error(`Erreur (${res.status})`);
    return res.json();
  }, [onAuthError]);

  const fetchDashboard = useCallback(() => {
    if (!token) return;
    setLoading(true);
    setError(null);

    const headers = { Authorization: `Token ${token}`, "Content-Type": "application/json" };
    const params = new URLSearchParams();
    if (filters.materiau)    params.set("materiau", filters.materiau);
    if (filters.type_meuble) params.set("type_meuble", filters.type_meuble);
    if (filters.statut)      params.set("statut", filters.statut);
    params.set("ordering", filters.ordering || "-date_creation");

    return Promise.all([
      fetch(`/api/v1/devis/?${params.toString()}`, { headers }).then(handleResponse),
      fetch("/api/v1/dashboard/stats/", { headers }).then(handleResponse),
    ])
      .then(([devisPage, statsData]) => {
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
        console.error("Erreur de récupération du dashboard :", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [token, filters.materiau, filters.type_meuble, filters.statut, filters.ordering, handleResponse]);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard()?.then(() => {
      if (cancelled) return;
    });
    return () => { cancelled = true; };
  }, [fetchDashboard]);
  
  const deleteQuote = useCallback(
    async (id) => {
      const previousQuotes = quotes;
      
      // 1. L'Illusionniste : Suppression optimiste
      setQuotes((current) => current.filter((q) => q.id !== id));

      try {
        const res = await fetch(`/api/v1/devis/${id}/`, {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        });

        // 2. Le Videur (issu de la branche Jason) : On expulse en cas de fraude
        if (res.status === 401 || res.status === 403) {
          onAuthError?.();
          throw new Error("Session invalide ou droits insuffisants.");
        }

        // 3. Le Prudent (issu de la branche Test) : On vérifie les erreurs serveur
        if (!res.ok && res.status !== 204) {
          throw new Error(`Erreur suppression (${res.status})`);
        }

        // 4. Succès : on re-synchronise la réalité avec le serveur
        fetchDashboard();
        return { success: true };
      } catch (err) {
        console.error("Erreur lors de la suppression du devis :", err);
        
        // 5. Le Filet de sécurité : On annule l'optimisme si le serveur a planté
        setQuotes(previousQuotes); 
        return { success: false, message: err.message };
      }
    },
    [token, quotes, fetchDashboard, onAuthError]
  );

  return { quotes, stats, recentClients, loading, error, deleteQuote };
}

export default useQuotes;
export { DEFAULT_FILTERS };