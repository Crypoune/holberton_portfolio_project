function Marquee({ items, renderItem, speed = 30 }) {
  const doubled = [...items, ...items];

  return (
    <div className="marquee">
      <div
        className="marquee__track"
        style={{ "--marquee-duration": `${speed}s` }}
      >
        {doubled.map((item, i) => (
          <div className="marquee__item" key={i}>
            {renderItem(item)}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Marquee;
