import { useTaskContext } from '../hooks/useTaskContext'
import TaskItem from './TaskItem'
import './TaskList.scss'

export function TaskList() {
  const { tasks, filteredTasks } = useTaskContext()

  if (tasks.length === 0) {
    return (
      <p className="task-list__empty">
        Завдань поки немає. Додайте перше навчальне завдання.
      </p>
    )
  }

  if (filteredTasks.length === 0) {
    return (
      <p className="task-list__empty">
        За цим фільтром завдань немає.
      </p>
    )
  }

  return (
    <section className="task-list" aria-label="Навчальні завдання">
      {filteredTasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </section>
  )
}

export default TaskList
