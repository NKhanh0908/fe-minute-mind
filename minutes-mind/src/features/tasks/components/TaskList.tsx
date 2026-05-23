import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'

import { Modal } from '../../../components/Modal'

import { useCreateTask } from '../hooks/useCreateTask'
import { useDeleteTask } from '../hooks/useDeleteTask'
import { useTasks } from '../hooks/useTasks'
import { useUpdateTaskStatus } from '../hooks/useUpdateTaskStatus'
import { useUpdateTask } from '../hooks/useUpdateTask'
import { TaskItem } from './TaskItem'
import { TaskForm } from './TaskForm'
import type { TaskResponse, TaskStatus } from '../../../types/api'

const LABELS = {
  title: 'Tasks',
  add: 'Th\u00eam task',
  loading: '\u0110ang t\u1ea3i tasks...',
  empty: 'Ch\u01b0a c\u00f3 task n\u00e0o cho goal n\u00e0y.',
  emptyFiltered: 'Kh\u00f4ng c\u00f3 task n\u00e0o kh\u1edbp filter.',
  noGoal: 'Ch\u1ecdn m\u1ed9t goal \u0111\u1ec3 xem tasks.',
  modalTitleCreate: 'T\u1ea1o task m\u1edbi',
  modalTitleEdit: 'S\u1eeda task',
} as const

const FILTERS: Array<'ALL' | TaskStatus> = ['ALL', 'TODO', 'IN_PROGRESS', 'DONE']

interface TaskListProps {
  goalId: number | null
}

export function TaskList({ goalId }: TaskListProps) {
  const [filter, setFilter] = useState<'ALL' | TaskStatus>('ALL')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskResponse | null>(null)
  
  const tasksQuery = useTasks(goalId)
  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const updateStatus = useUpdateTaskStatus()
  const deleteTask = useDeleteTask()

  const tasks = useMemo(() => tasksQuery.data ?? [], [tasksQuery.data])

  const filteredTasks = useMemo(() => {
    if (filter === 'ALL') return tasks
    return tasks.filter((task) => task.status === filter)
  }, [tasks, filter])

  if (goalId === null) {
    return (
      <div className="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
        {LABELS.noGoal}
      </div>
    )
  }

  const handleEdit = (task: TaskResponse) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('B\u1ea1n c\u00f3 ch\u1eafc ch\u1eafn mu\u1ed1n x\u00f3a task n\u00e0y?')) {
      deleteTask.mutate({ id, goalId })
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">{LABELS.title}</h3>
        <div className="flex flex-wrap gap-1">
          {FILTERS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`rounded-lg px-2.5 py-1 text-xs transition ${
                filter === value ? 'bg-brand text-white' : 'bg-surface-2 text-text-muted hover:text-text-primary'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingTask(null)
            setModalOpen(true)
          }}
          className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition hover:bg-brand-dark"
        >
          <Plus size={16} />
          {LABELS.add}
        </button>
      </div>

      {tasksQuery.isLoading ? (
        <p className="text-sm text-text-muted">{LABELS.loading}</p>
      ) : null}

      {!tasksQuery.isLoading && tasks.length === 0 ? (
        <p className="text-sm text-text-muted">{LABELS.empty}</p>
      ) : null}

      {!tasksQuery.isLoading && tasks.length > 0 && filteredTasks.length === 0 ? (
        <p className="text-sm text-text-muted">{LABELS.emptyFiltered}</p>
      ) : null}

      <div className="space-y-2">
        {filteredTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onStatusChange={(id, status) => updateStatus.mutate({ id, goalId, status })}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal 
        isOpen={modalOpen} 
        onClose={handleCloseModal} 
        title={editingTask ? LABELS.modalTitleEdit : LABELS.modalTitleCreate}
      >
        <TaskForm
          goalId={goalId}
          defaultValues={editingTask ?? undefined}
          submitting={createTask.isPending || updateTask.isPending}
          onCancel={handleCloseModal}
          onSubmit={(body) => {
            if (editingTask) {
              updateTask.mutate(
                { id: editingTask.id, data: body },
                { onSuccess: handleCloseModal }
              )
            } else {
              createTask.mutate(body, { onSuccess: handleCloseModal })
            }
          }}
        />
      </Modal>
    </div>
  )
}
