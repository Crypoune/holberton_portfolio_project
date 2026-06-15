function StatCard({ label, value, colorClass }) {
  return (
    <div className="stat-card">
      <span className={`stat-card__value ${colorClass}`}>{value}</span>
      <span className="stat-card__label">{label}</span>
    </div>
  );
}

export default StatCard;
