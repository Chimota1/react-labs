import type { Task } from '../types'
import TaskItem from './TaskItem'

type TaskListProps = {
  tasks: Task[]
  onToggleTask: (id: number) => void
}

function TaskList({ tasks, onToggleTask }: TaskListProps) {
  if (tasks.length === 0) return <p className="empty-state">Завдань не знайдено.</p>

  return (
    <section className="task-list" aria-label="Навчальні завдання">
      {tasks.map((task) => <TaskItem key={task.id} task={task} onToggleTask={onToggleTask} />)}
    </section>
  )
}

export default TaskList
