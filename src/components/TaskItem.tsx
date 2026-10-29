import type { Task } from '../types'

type TaskItemProps = {
  task: Task
  onToggleTask: (id: number) => void
}

function TaskItem({ task, onToggleTask }: TaskItemProps) {
  return (
    <article className={`task-card${task.completed ? ' task-card--completed' : ''}`}>
      <div className="task-card__header">
        <h2>{task.title}</h2>
        <span className={`priority priority--${task.priority}`}>{task.priority}</span>
      </div>
      <p>{task.description}</p>
      <div className="task-card__footer">
        <span>{task.category}</span>
        <label>
          <input type="checkbox" checked={task.completed} onChange={() => onToggleTask(task.id)} />
          {task.completed ? 'Виконано' : 'Не виконано'}
        </label>
      </div>
    </article>
  )
}

export default TaskItem
