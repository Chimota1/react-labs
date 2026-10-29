import type { Task } from '../types'

type TaskItemProps = {
  task: Task
  onToggleTask: (id: number) => void
  onDeleteTask: (id: number) => void
}

function TaskItem({ task, onToggleTask, onDeleteTask }: TaskItemProps) {
  return (
    <article className={`task-card${task.completed ? ' task-card--completed' : ''}`}>
      <div className="task-card__header">
        <h2>{task.title}</h2>
        <span className={`priority priority--${task.priority}`}>{task.priority}</span>
      </div>
      <p>{task.description}</p>
      <div className="task-card__footer">
        <div className="task-card__meta">
          <span>{task.category}</span>
          <span>{task.completed ? 'Виконано' : 'Не виконано'}</span>
        </div>
        <div className="task-card__actions">
          <button type="button" onClick={() => onToggleTask(task.id)}>
            {task.completed ? 'Відновити' : 'Виконати'}
          </button>
          <button type="button" onClick={() => onDeleteTask(task.id)}>
            Видалити
          </button>
        </div>
      </div>
    </article>
  )
}

export default TaskItem
