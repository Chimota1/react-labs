import { useTaskContext } from '../hooks/useTaskContext'
import ErrorMessage from './ErrorMessage'
import LoadingSpinner from './LoadingSpinner'
import Pagination from './Pagination'
import TaskItem from './TaskItem'
import './TaskList.scss'

export function TaskList() {
  const {
    tasks,
    filteredTasks,
    isLoading,
    error,
    total,
    currentPage,
    totalPages,
    pageSize,
    setPage,
    fetchTasks,
    cancelGetRequest,
  } = useTaskContext()

  if (isLoading && tasks.length === 0) {
    return (
      <LoadingSpinner
        message="Завантаження списку завдань із DummyJSON API..."
        onCancel={cancelGetRequest}
      />
    )
  }

  if (error && tasks.length === 0) {
    return <ErrorMessage message={error} onRetry={fetchTasks} />
  }

  return (
    <section className="task-list-section" aria-label="Список навчальних завдань">
      {isLoading && (
        <LoadingSpinner
          message="Оновлення даних сторінки..."
          onCancel={cancelGetRequest}
        />
      )}

      {error && !isLoading && (
        <ErrorMessage message={error} onRetry={fetchTasks} />
      )}

      {!isLoading && filteredTasks.length === 0 && (
        <p className="task-list__empty">
          {tasks.length === 0
            ? 'Завдань не знайдено на сервері.'
            : 'За цим фільтром або пошуковим запитом завдань не знайдено.'}
        </p>
      )}

      <div className="task-list">
        {filteredTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={total}
        pageSize={pageSize}
        isLoading={isLoading}
        onPageChange={setPage}
      />
    </section>
  )
}

export default TaskList
