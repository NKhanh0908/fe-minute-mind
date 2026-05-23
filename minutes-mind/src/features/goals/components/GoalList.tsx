import { useState } from 'react'
import { Plus } from 'lucide-react'

import { Modal } from '../../../components/Modal'
import { useCreateGoal } from '../hooks/useCreateGoal'
import { useDeleteGoal } from '../hooks/useDeleteGoal'
import { useGoals } from '../hooks/useGoals'
import { useUpdateGoal } from '../hooks/useUpdateGoal'
import type { GoalResponse } from '../../../types/api'
import { GoalCard } from './GoalCard'
import { GoalForm } from './GoalForm'

const LABELS = {
  title: 'Goals',
  add: 'Thêm Goal',
  loading: 'Đang tải goals...',
  modalTitle: 'Tạo goal mới',
  errorFallback: 'Không tải được danh sách goals.',
} as const

interface GoalListProps {
  selectedGoalId: number | null
  onSelectGoal: (goalId: number) => void
}

export function GoalList({ selectedGoalId, onSelectGoal }: GoalListProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editingGoal, setEditingGoal] = useState<GoalResponse | null>(null)
  const goalsQuery = useGoals()
  const createGoal = useCreateGoal()
  const updateGoal = useUpdateGoal()
  const deleteGoal = useDeleteGoal()

  const goals = goalsQuery.data ?? []

  const handleEdit = (goal: GoalResponse) => {
    setEditingGoal(goal)
    setModalOpen(true)
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa Goal này không? Toàn bộ Task sẽ bị xóa theo.')) {
      deleteGoal.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingGoal(null)
  }

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-text-primary">{LABELS.title}</h2>
          <p className="text-xs text-text-muted mt-0.5">
            {goals.length} goal{goals.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setEditingGoal(null); setModalOpen(true) }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-white transition-all hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-95"
        >
          <Plus size={15} />
          {LABELS.add}
        </button>
      </div>

      {goalsQuery.isLoading ? (
        <p className="text-sm text-text-muted">{LABELS.loading}</p>
      ) : null}

      {goalsQuery.isError ? (
        <p className="rounded-xl border border-border bg-surface p-4 text-sm text-status-danger">
          {LABELS.errorFallback}
        </p>
      ) : null}

      {/* Empty state */}
      {!goalsQuery.isLoading && goals.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-border bg-surface p-12 text-center">
          <div className="text-5xl opacity-30">🎯</div>
          <div>
            <h3 className="text-base font-semibold text-text-primary">Chưa có goal nào</h3>
            <p className="mt-1 text-sm text-text-muted">Tạo goal đầu tiên để bắt đầu theo dõi tiến độ</p>
          </div>
          <button
            onClick={() => { setEditingGoal(null); setModalOpen(true) }}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-dark transition-all active:scale-95"
          >
            <Plus size={16} />
            Tạo goal đầu tiên
          </button>
        </div>
      ) : null}

      <div className="grid gap-3 md:grid-cols-2">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            selected={goal.id === selectedGoalId}
            onSelect={onSelectGoal}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editingGoal ? 'Sửa Goal' : LABELS.modalTitle}
      >
        <GoalForm
          defaultValues={editingGoal ?? undefined}
          submitting={createGoal.isPending || updateGoal.isPending}
          onCancel={handleCloseModal}
          onSubmit={(body) => {
            if (editingGoal) {
              updateGoal.mutate(
                { id: editingGoal.id, body },
                { onSuccess: handleCloseModal }
              )
            } else {
              createGoal.mutate(body, { onSuccess: handleCloseModal })
            }
          }}
        />
      </Modal>
    </section>
  )
}
