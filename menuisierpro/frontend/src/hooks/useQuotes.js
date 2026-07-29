import { useState, useEffect, useCallback } from "react";

// Hook custom responsable de toute la logique DATA du dashboard.
// Il centralise :
// - la récupération des devis
// - les statistiques
// - les derniers clients
// - la suppression d'un devis
//
// Le composant Dashboard.jsx reste uniquement responsable de l'affichage.
// Cette séparation évite de mélanger logique métier et interface.
 
// Filtres utilisés par défaut à l'ouverture du dashboard.
const DEFAULT_FILTERS = {
  materiau: "",
  type_meuble: "",
  statut: "",
  // Les devis les plus récents apparaissent en premier.
  ordering: "-date_creation",
};

// token : jeton d'authentification envoyé à l'API Django REST.
// filters : paramètres de recherche du dashboard.
// onAuthError : callback permettant au parent de gérer une session expirée.
function useQuotes(token, filters = DEFAULT_FILTERS, onAuthError) {
  const [quotes, setQuotes] = useState([]);
  const [recentClients, setRecentClients] = useState([]);

  // Statistiques affichées dans les cartes du dashboard.
  // Elles proviennent d'un endpoint dédié.
  const [stats, setStats] = useState({ total: 0, enAttente: 0, acceptes: 0, aRelancer: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fonction utilitaire commune pour traiter les réponses API.
  // Elle centralise :
  // - les erreurs d'authentification (401/403)
  // - les erreurs serveur classiques
  //
  // Cela évite de répéter la même logique dans chaque fetch.
  const handleResponse = useCallback((res) => {
    if (res.status === 401 || res.status === 403) {
      onAuthError?.();
      throw new Error("Session invalide ou droits insuffisants.");
    }
    if (!res.ok) throw new Error(`Erreur (${res.status})`);
    return res.json();
  }, [onAuthError]);

  // Récupération principale des données du dashboard.
  const fetchDashboard = useCallback(() => {
    // Sans token, on ne contacte pas l'API protégée.
    if (!token) return;

    setLoading(true);
    setError(null);

    const headers = {
      Authorization: `Token ${token}`,
      "Content-Type": "application/json",
    };


    // Construction dynamique des paramètres de recherche.
    // On envoie uniquement les filtres actifs.
    const params = new URLSearchParams();

    if (filters.materiau)    params.set("materiau", filters.materiau);
    if (filters.type_meuble) params.set("type_meuble", filters.type_meuble);
    if (filters.statut)      params.set("statut", filters.statut);
    params.set("ordering", filters.ordering || "-date_creation");

    // Les deux requêtes sont indépendantes :
    // - récupération des devis
    // - récupération des statistiques
    //
    // Promise.all permet de les lancer en parallèle pour réduire
    // le temps de chargement du dashboard.
    return Promise.all([
      fetch(`/api/v1/devis/?${params.toString()}`, { headers }).then(handleResponse),
      fetch("/api/v1/dashboard/stats/", { headers }).then(handleResponse),
    ])
      .then(([devisPage, statsData]) => {
        // Compatible avec une réponse paginée ou non de Django REST Framework.
        setQuotes(
          Array.isArray(devisPage.results)
            ? devisPage.results
            : devisPage
        );

        setStats({
          total: statsData.devis.total,
          enAttente: statsData.devis.en_attente,
          acceptes: statsData.devis.acceptes,
          aRelancer: statsData.devis.a_relancer,
        });

        setRecentClients(
          statsData.dernieres_inscriptions || []
        );
      })

      .catch((err) => {

        console.error(
          "Erreur de récupération du dashboard :",
          err
        );

        setError(err.message);
      })

      .finally(() => setLoading(false));

  }, [
    token,
    filters.materiau,
    filters.type_meuble,
    filters.statut,
    filters.ordering,
    handleResponse,
  ]);

  // Recharge automatiquement les données lorsque :
  // - l'utilisateur se connecte
  // - un filtre change
  //
  // useCallback évite de recréer inutilement fetchDashboard.
  // useEffect déclenche automatiquement le chargement lors du premier affichage du composant
  // puis lorsque fetchDashboard change.
  useEffect(() => {
    // Prévu pour une future gestion de l'annulation des requêtes asynchrones (AbortController).
    let cancelled = false;
    fetchDashboard()?.then(() => {
      if (cancelled) return;
    });
    return () => { cancelled = true; };
  }, [fetchDashboard]);
  
  // Suppression d'un devis avec mise à jour optimiste.
  //
  // L'interface est mise à jour immédiatement pour une meilleure UX.
  // Si l'API échoue, on restaure l'ancien état.
  const deleteQuote = useCallback(
    async (id) => {
      const previousQuotes = quotes;
      
      // Suppression immédiate côté interface.
      setQuotes((current) => current.filter((q) => q.id !== id));

      try {
        const res = await fetch(`/api/v1/devis/${id}/`, {
          method: "DELETE",
          headers: { Authorization: `Token ${token}` },
        });

        // Gestion spécifique des problèmes d'autorisation.
        if (res.status === 401 || res.status === 403) {
          onAuthError?.();
          throw new Error("Session invalide ou droits insuffisants.");
        }

        // Une suppression réussie renvoie généralement 204 No Content.
        if (!res.ok && res.status !== 204) {
          throw new Error(`Erreur suppression (${res.status})`);
        }

        // Synchronisation finale avec le serveur.
        fetchDashboard();
        return { success: true };
      } catch (err) {
        console.error("Erreur lors de la suppression du devis :", err);
        
        // Rollback : restauration de l'état précédent si la suppression échoue.
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