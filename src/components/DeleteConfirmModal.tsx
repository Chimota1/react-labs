import './DeleteConfirmModal.scss'

type DeleteConfirmModalProps = {
  isOpen: boolean
  taskTitle: string
  isDeleting?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteConfirmModal({
  isOpen,
  taskTitle,
  isDeleting = false,
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div
      className="delete-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-confirm-title"
    >
      <div className="delete-modal__backdrop" onClick={isDeleting ? undefined : onCancel} />

      <div className="delete-modal__box">
        <div className="delete-modal__icon">🗑️</div>

        <h3 id="delete-confirm-title" className="delete-modal__title">
          Підтвердження видалення
        </h3>

        <p className="delete-modal__desc">
          Ви впевнені, що хочете видалити завдання{' '}
          <strong>«{taskTitle}»</strong>? Запит буде надіслано до REST API.
        </p>

        <div className="delete-modal__actions">
          <button
            type="button"
            className="delete-modal__btn delete-modal__btn--cancel"
            disabled={isDeleting}
            onClick={onCancel}
          >
            Скасувати
          </button>
          <button
            type="button"
            className="delete-modal__btn delete-modal__btn--delete"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting ? 'Видалення...' : 'Так, видалити'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmModal
