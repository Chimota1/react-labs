import { useTaskContext } from '../hooks/useTaskContext'
import './TaskToolbar.scss'

export function TaskToolbar() {
  const { fetchTasks, cancelGetRequest, isLoading, total } = useTaskContext()

  return (
    <div className="task-toolbar" aria-label="Панель керування">
      <div className="task-toolbar__info">
        <span className="task-toolbar__badge">REST API: DummyJSON</span>
        <span className="task-toolbar__count">Всього на сервері: {total}</span>
      </div>

      <div className="task-toolbar__actions">
        {isLoading && (
          <button
            type="button"
            className="task-toolbar__button task-toolbar__button--cancel"
            onClick={cancelGetRequest}
            title="Скасувати поточний GET-запит за допомогою AbortController"
          >
            ⏹ Скасувати GET-запит
          </button>
        )}
        <button
          type="button"
          className="task-toolbar__button task-toolbar__button--refresh"
          disabled={isLoading}
          onClick={fetchTasks}
          title="Оновити список із REST API"
        >
          {isLoading ? 'Оновлення...' : '🔄 Оновити з API'}
        </button>
      </div>
    </div>
  )
}

export default TaskToolbar
