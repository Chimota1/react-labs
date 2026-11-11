import { useTaskContext } from '../hooks/useTaskContext'
import './Toast.scss'

export function Toast() {
  const { toast, hideToast } = useTaskContext()

  if (!toast) {
    return null
  }

  const { message, type, action, hasProgressBar, duration = 5000 } = toast

  return (
    <aside
      className={`toast toast--${type}${hasProgressBar ? ' toast--has-progress' : ''}`}
      role="status"
      aria-live="polite"
    >
      <div className="toast__content">
        <span className="toast__message">{message}</span>
        {action && (
          <button
            type="button"
            className="toast__action-btn"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
        <button
          type="button"
          className="toast__close-btn"
          aria-label="Закрити сповіщення"
          onClick={hideToast}
        >
          &times;
        </button>
      </div>

      {hasProgressBar && (
        <div className="toast__progress-track">
          <div
            className="toast__progress-bar"
            style={{ animationDuration: `${duration}ms` }}
          />
        </div>
      )}
    </aside>
  )
}

export default Toast
