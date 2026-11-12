import './ErrorMessage.scss'

type ErrorMessageProps = {
  message: string
  onRetry?: () => void
}

export function ErrorMessage({
  message,
  onRetry,
}: ErrorMessageProps) {
  return (
    <div className="error-state" role="alert">
      <div className="error-state__icon">⚠️</div>
      <p className="error-state__message">{message}</p>
      {onRetry && (
        <button
          type="button"
          className="error-state__retry-btn"
          onClick={onRetry}
        >
          Спробувати ще
        </button>
      )}
    </div>
  )
}

export default ErrorMessage
