// Composant de carousel horizontal réutilisable.
// Il ne connaît pas le contenu qu'il affiche : il reçoit simplement
// une liste (`items`) et une fonction (`renderItem`) pour afficher chaque élément.
// L'animation est gérée entièrement par le SCSS.
function Marquee({ items, renderItem, speed = 30 }) {
  // On duplique la liste afin de créer un défilement continu.
  // Quand la première série disparaît, la seconde prend immédiatement sa place,
  // ce qui donne l'impression d'une boucle infinie.
  const doubled = [...items, ...items];

  return (
    <div className="marquee">
      <div
        className="marquee__track"
        // On transmet simplement la durée de l'animation au CSS.
        // Les keyframes restent définies dans le fichier SCSS.
        style={{ "--marquee-duration": `${speed}s` }}
      >
        {doubled.map((item, i) => (
          // L'index est suffisant ici car la liste ne change jamais pendant l'exécution.
          <div className="marquee__item" key={i}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
