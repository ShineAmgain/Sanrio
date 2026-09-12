export default function ErrorState({
  message = "Unable to load research data. Please try again.",
  onRetry,
}) {
  return (
    <div className="empty-state error-state">
      <p>{message}</p>
      {onRetry && (
        <button className="btn btn-secondary" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
