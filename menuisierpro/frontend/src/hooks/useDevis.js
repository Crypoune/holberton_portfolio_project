import { useState, useEffect } from 'react'

const MOCK_DEVIS = [
  {
    id: 1,
    client: { nom: 'Rakoto Michel', telephone_whatsapp: '261340001234' },
    type_meuble: 'Table en palissandre',
    statut: 'en_attente',
    date_creation: '2026-06-10T08:00:00Z',
    date_relance_j3: null,
    date_relance_j7: null,
    message_whatsapp_genere: ''
  },
  {
    id: 2,
    client: { nom: 'Rasoamanana Hanta', telephone_whatsapp: '261340005678' },
    type_meuble: 'Armoire sur mesure',
    statut: 'relance_j3',
    date_creation: '2026-06-07T08:00:00Z',
    date_relance_j3: '2026-06-10T08:00:00Z',
    date_relance_j7: null,
    message_whatsapp_genere: ''
  },
  {
    id: 3,
    client: { nom: 'Andrianaivo Jean', telephone_whatsapp: '261340009876' },
    type_meuble: 'Bibliothèque murale',
    statut: 'converti',
    date_creation: '2026-06-05T08:00:00Z',
    date_relance_j3: '2026-06-08T08:00:00Z',
    date_relance_j7: null,
    message_whatsapp_genere: ''
  },
  {
    id: 4,
    client: { nom: 'Razafy Sophie', telephone_whatsapp: '261340004321' },
    type_meuble: 'Chaises en bois massif',
    statut: 'en_attente',
    date_creation: '2026-06-13T08:00:00Z',
    date_relance_j3: null,
    date_relance_j7: null,
    message_whatsapp_genere: ''
  },
]

function useDevis() {
  const [devis, setDevis] = useState(MOCK_DEVIS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const stats = {
    total: devis.length,
    enAttente: devis.filter((d) => d.statut === 'en_attente').length,
    acceptes: devis.filter((d) => d.statut === 'converti').length,
    aRelancer: devis.filter((d) => d.statut === 'relance_j3' || d.statut === 'relance_j7').length,
  }

  return { devis, stats, loading, error }
}

export default useDevis