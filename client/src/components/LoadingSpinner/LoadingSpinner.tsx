import "./LoadingSpinner.css";

export default function LoadingSpinner() {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner__icon" />
      <span className="loading-spinner__text">Loading...</span>
    </div>
  );
}
