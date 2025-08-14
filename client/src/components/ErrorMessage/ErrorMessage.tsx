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
      <span className="error-icon">⚠</span>
      <span>{message}</span>
    </div>
  );
}
