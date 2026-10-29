import type { Task } from '../types'

type TaskStatsProps = {
  tasks: Task[]
}

function TaskStats({ tasks }: TaskStatsProps) {
  const completedCount = tasks.filter((task) => task.completed).length
  return <p className="task-stats">Усього: {tasks.length} | Виконано: {completedCount} | Залишилось: {tasks.length - completedCount}</p>
}

export default TaskStats
