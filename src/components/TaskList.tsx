import type { Task } from '../types'
import TaskItem from './TaskItem'

type TaskListProps = {
  tasks: Task[]
  onToggleTask: (id: number) => void
  onDeleteTask: (id: number) => void
}

function TaskList({ tasks, onToggleTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) return <p className="empty-state">Завдань не знайдено.</p>

  return (
    <section className="task-list" aria-label="Навчальні завдання">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
        />
      ))}
    </section>
  )
}

export default TaskList
