import './LoadingSpinner.scss'

type LoadingSpinnerProps = {
  message?: string
  onCancel?: () => void
}

export function LoadingSpinner({
  message = 'Завантаження завдань...',
  onCancel,
}: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__circle" />
      <p className="loading-spinner__text">{message}</p>
      {onCancel && (
        <button
          type="button"
          className="loading-spinner__cancel-btn"
          onClick={onCancel}
          title="Перервати HTTP GET-запит за допомогою AbortController"
        >
          ⏹ Скасувати GET-запит
        </button>
      )}
    </div>
  )
}

export default LoadingSpinner
