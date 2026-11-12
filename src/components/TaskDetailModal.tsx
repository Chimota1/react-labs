import { useEffect, useState } from 'react'
import { taskRepository } from '../repositories/taskRepository'
import type { Task } from '../types'
import './TaskDetailModal.scss'

type TaskDetailModalProps = {
  taskId: number | null
  onClose: () => void
}

export function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
  const [task, setTask] = useState<Task | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (taskId === null) {
      return
    }

    const controller = new AbortController()
    let isCancelled = false

    const fetchDetails = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await taskRepository.getById(taskId, controller.signal)
        if (!isCancelled) {
          setTask(data)
        }
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          // Request was cancelled intentionally, do not display as error
          return
        }
        if (!isCancelled) {
          setError(err instanceof Error ? err.message : 'Не вдалося завантажити деталі завдання')
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchDetails()

    return () => {
      isCancelled = true
      controller.abort()
    }
  }, [taskId])

  if (taskId === null) {
    return null
  }

  return (
    <div
      className="task-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
    >
      <div className="task-modal__backdrop" onClick={onClose} />

      <div className="task-modal__card">
        <div className="task-modal__header">
          <h2 id="task-detail-title" className="task-modal__title">
            Деталі завдання #{taskId}
          </h2>
          <button
            type="button"
            className="task-modal__close-btn"
            onClick={onClose}
            aria-label="Закрити модальне вікно"
          >
            &times;
          </button>
        </div>

        <div className="task-modal__body">
          {isLoading && (
            <div className="task-modal__loading">
              <div className="task-modal__spinner" />
              <span>Отримання актуальних даних із сервера...</span>
            </div>
          )}

          {error && (
            <div className="task-modal__error">
              <p>{error}</p>
              <button
                type="button"
                className="task-modal__retry-btn"
                onClick={() => {
                  setTask(null)
                  setError(null)
                }}
              >
                Закрити
              </button>
            </div>
          )}

          {!isLoading && !error && task && (
            <dl className="task-modal__details">
              <div className="task-modal__row">
                <dt className="task-modal__label">Назва:</dt>
                <dd className="task-modal__value task-modal__value--title">
                  {task.title}
                </dd>
              </div>

              <div className="task-modal__row">
                <dt className="task-modal__label">Статус:</dt>
                <dd className="task-modal__value">
                  <span
                    className={`task-modal__status-badge ${
                      task.completed
                        ? 'task-modal__status-badge--completed'
                        : 'task-modal__status-badge--active'
                    }`}
                  >
                    {task.completed ? 'Виконано' : 'В процесі'}
                  </span>
                </dd>
              </div>

              <div className="task-modal__row">
                <dt className="task-modal__label">Пріоритет:</dt>
                <dd className="task-modal__value">
                  <span className={`priority priority--${task.priority}`}>
                    {task.priority}
                  </span>
                </dd>
              </div>

              <div className="task-modal__row">
                <dt className="task-modal__label">Категорія:</dt>
                <dd className="task-modal__value">
                  {task.category || 'Загальна'}
                </dd>
              </div>

              <div className="task-modal__row">
                <dt className="task-modal__label">Опис:</dt>
                <dd className="task-modal__value task-modal__value--desc">
                  {task.description || '(Опис відсутній у відповіді API)'}
                </dd>
              </div>

              <div className="task-modal__row">
                <dt className="task-modal__label">Джерело даних:</dt>
                <dd className="task-modal__value task-modal__value--source">
                  REST API: <code>/todos/{task.id}</code> (DummyJSON)
                </dd>
              </div>
            </dl>
          )}
        </div>

        <div className="task-modal__footer">
          <button
            type="button"
            className="task-modal__btn"
            onClick={onClose}
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailModal
