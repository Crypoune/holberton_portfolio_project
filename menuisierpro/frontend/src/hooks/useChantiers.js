import { useState, useEffect } from 'react'

const MOCK_CHANTIERS = [
  { id: 1, titre: 'Table en palissandre', type_travaux: 'Table', materiau_utilise: 'Palissandre', localisation: 'Antananarivo', slug: 'table-palissandre', image_principale: 'https://picsum.photos/seed/table1/400/300' },
  { id: 2, titre: 'Armoire sur mesure', type_travaux: 'Armoire', materiau_utilise: 'Chêne', localisation: 'Antananarivo', slug: 'armoire-sur-mesure', image_principale: 'https://picsum.photos/seed/armoire1/400/300' },
  { id: 3, titre: 'Bibliothèque moderne', type_travaux: 'Bibliothèque', materiau_utilise: 'Pin', localisation: 'Antsirabe', slug: 'bibliotheque-moderne', image_principale: 'https://picsum.photos/seed/biblio1/400/300' },
  { id: 4, titre: 'Cuisine intégrée', type_travaux: 'Cuisine', materiau_utilise: 'Chêne', localisation: 'Antananarivo', slug: 'cuisine-integree', image_principale: 'https://picsum.photos/seed/cuisine1/400/300' },
  { id: 5, titre: 'Dressing personnalisé', type_travaux: 'Dressing', materiau_utilise: 'Pin', localisation: 'Antsirabe', slug: 'dressing-personnalise', image_principale: 'https://picsum.photos/seed/dressing1/400/300' },
  { id: 6, titre: 'Table basse artisanale', type_travaux: 'Table', materiau_utilise: 'Palissandre', localisation: 'Antananarivo', slug: 'table-basse', image_principale: 'https://picsum.photos/seed/tablebasse1/400/300' },
]

function useChantiers() {
  const [chantiers, setChantiers] = useState(MOCK_CHANTIERS)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // À activer quand Django tourne :
  // useEffect(() => {
  //   fetch('/api/v1/chantiers/')
  //     .then((res) => res.json())
  //     .then(setChantiers)
  //     .catch((err) => setError(err.message))
  //     .finally(() => setLoading(false))
  // }, [])

  return { chantiers, loading, error }
}

export default useChantiers