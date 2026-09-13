export default function LoadingState({ count = 4, label = "Loading..." }) {
  return (
    <div className="state-grid" role="status" aria-live="polite">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i} aria-hidden="true" />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}
