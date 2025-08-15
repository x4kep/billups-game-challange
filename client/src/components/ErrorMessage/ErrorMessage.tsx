import "./ErrorMessage.css";

type ErrorMessageProps = {
  message: string;
  className?: string;
};

export default function ErrorMessage({
  message,
  className,
}: ErrorMessageProps) {
  return (
    <div className={`error-message ${className || ""}`}>
      <span className="error-message__icon">⚠</span>
      <span className="error-message__text">{message}</span>
    </div>
  );
}
