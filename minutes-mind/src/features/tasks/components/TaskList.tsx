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
  add: 'Thêm task',
  loading: 'Đang tải tasks...',
  empty: 'Chưa có task nào cho goal này.',
  emptyFiltered: 'Không có task nào khớp filter.',
  noGoal: 'Chọn một goal để xem tasks.',
  modalTitleCreate: 'Tạo task mới',
  modalTitleEdit: 'Sửa task',
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
      <div className="rounded-2xl border border-border bg-surface p-6 text-center">
        <div className="text-3xl opacity-30 mb-2">📋</div>
        <p className="text-sm text-text-muted">{LABELS.noGoal}</p>
      </div>
    )
  }

  const handleEdit = (task: TaskResponse) => {
    setEditingTask(task)
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa task này?')) {
      deleteTask.mutate({ id, goalId })
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingTask(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h3 className="text-base font-semibold text-text-primary">{LABELS.title}</h3>
          {/* Filter pills */}
          <div className="flex gap-1">
            {FILTERS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setFilter(value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all duration-150 ${
                  filter === value
                    ? 'bg-brand text-white shadow-sm shadow-brand/30'
                    : 'bg-surface-2 text-text-muted hover:text-text-primary hover:bg-border'
                }`}
              >
                {value}
              </button>
            ))}
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setEditingTask(null); setModalOpen(true) }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-3 py-1.5 text-sm font-medium text-white transition-all hover:bg-brand-dark active:scale-95"
        >
          <Plus size={14} />
          {LABELS.add}
        </button>
      </div>

      {/* Task container */}
      <div className="rounded-2xl border border-border bg-surface p-4">
        {tasksQuery.isLoading ? (
          <p className="text-sm text-text-muted">{LABELS.loading}</p>
        ) : null}

        {!tasksQuery.isLoading && tasks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <div className="text-3xl opacity-30">📋</div>
            <p className="text-sm text-text-muted">{LABELS.empty}</p>
          </div>
        ) : null}

        {!tasksQuery.isLoading && tasks.length > 0 && filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-10 text-center">
            <div className="text-3xl opacity-30">🔍</div>
            <p className="text-sm text-text-muted">{LABELS.emptyFiltered}</p>
          </div>
        ) : null}

        <div className="divide-y divide-border/40">
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
