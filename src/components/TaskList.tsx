import type { Task } from '../types'
import TaskItem from './TaskItem'

type TaskListProps = {
  tasks: Task[]
  emptyMessage: string
  onToggleTask: (id: number) => void
  onDeleteTask: (id: number) => void
}

function TaskList({ tasks, emptyMessage, onToggleTask, onDeleteTask }: TaskListProps) {
  if (tasks.length === 0) {
    return <p className="empty-state">{emptyMessage}</p>
  }

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
