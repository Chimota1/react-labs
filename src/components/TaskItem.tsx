import { useTaskContext } from '../hooks/useTaskContext'
import type { Task } from '../types'
import './TaskItem.scss'

type TaskItemProps = {
  task: Task
}

export function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, requestDelete, undoDelete, setEditingTask } = useTaskContext()

  const isPending = Boolean(task.isPendingDelete)

  return (
    <article
      className={`task-card${task.completed ? ' task-card--completed' : ''}${
        isPending ? ' task-card--pending-delete' : ''
      }`}
    >
      <div className="task-card__header">
        <div className="task-card__title-wrap">
          <h2 className="task-card__title">{task.title}</h2>
          {isPending && (
            <span className="task-card__pending-badge">Буде видалено</span>
          )}
        </div>
        <span className={`priority priority--${task.priority}`}>{task.priority}</span>
      </div>

      <p className="task-card__description">{task.description}</p>

      <div className="task-card__footer">
        <div className="task-card__meta">
          {task.category && <span className="task-card__category">{task.category}</span>}
          <span className="task-card__status">
            {task.completed ? 'Виконано' : 'Не виконано'}
          </span>
        </div>

        <div className="task-card__actions">
          {isPending ? (
            <button
              type="button"
              className="task-card__button task-card__button--undo"
              onClick={() => undoDelete(task.id)}
            >
              Скасувати
            </button>
          ) : (
            <>
              <button
                type="button"
                className="task-card__button task-card__button--edit"
                onClick={() => setEditingTask(task)}
              >
                Редагувати
              </button>
              <button
                type="button"
                className="task-card__button task-card__button--toggle"
                onClick={() => toggleTask(task.id)}
              >
                {task.completed ? 'Відновити' : 'Виконати'}
              </button>
              <button
                type="button"
                className="task-card__button task-card__button--delete"
                onClick={() => requestDelete(task.id)}
              >
                Видалити
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  )
}

export default TaskItem
