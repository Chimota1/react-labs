import './LoadingSpinner.scss'

type LoadingSpinnerProps = {
  message?: string
}

export function LoadingSpinner({
  message = 'Завантаження завдань...',
}: LoadingSpinnerProps) {
  return (
    <div className="loading-spinner" role="status" aria-live="polite">
      <div className="loading-spinner__circle" />
      <p className="loading-spinner__text">{message}</p>
    </div>
  )
}

export default LoadingSpinner
