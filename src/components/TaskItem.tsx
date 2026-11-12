import { useTaskContext } from '../hooks/useTaskContext'
import type { Task } from '../types'
import './TaskItem.scss'

type TaskItemProps = {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, openDeleteModal, setEditingTask, openDetailModal } =
    useTaskContext()

  return (
    <article
      className={`task-card${task.completed ? ' task-card--completed' : ''}`}
    >
      <div className="task-card__header">
        <div className="task-card__title-wrap">
          <span className="task-card__id">#{task.id}</span>
          <h2
            className="task-card__title"
            title="Натисніть для перегляду деталей"
            onClick={() => openDetailModal(task.id)}
          >
            {task.title}
          </h2>
        </div>
        <span className={`priority priority--${task.priority}`}>{task.priority}</span>
      </div>

      {task.description && (
        <p className="task-card__description">{task.description}</p>
      )}

      <div className="task-card__footer">
        <div className="task-card__meta">
          {task.category && (
            <span className="task-card__category">{task.category}</span>
          )}
          <span className="task-card__status">
            {task.completed ? 'Виконано' : 'В процесі'}
          </span>
        </div>

        <div className="task-card__actions">
          <button
            type="button"
            className="task-card__button task-card__button--detail"
            onClick={() => openDetailModal(task.id)}
            title="Переглянути деталі завдання (GET /todos/:id)"
          >
            Деталі
          </button>
          <button
            type="button"
            className="task-card__button task-card__button--edit"
            onClick={() => setEditingTask(task)}
            title="Редагувати завдання (PUT)"
          >
            Редагувати
          </button>
          <button
            type="button"
            className="task-card__button task-card__button--toggle"
            onClick={() => toggleTask(task.id)}
            title="Змінити статус (Optimistic Update)"
          >
            {task.completed ? 'Відновити' : 'Виконати'}
          </button>
          <button
            type="button"
            className="task-card__button task-card__button--delete"
            onClick={() => openDeleteModal(task)}
            title="Видалити завдання (DELETE)"
          >
            Видалити
          </button>
        </div>
      </div>
    </article>
  )
}

export default TaskItem
