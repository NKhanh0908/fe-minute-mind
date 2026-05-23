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
  add: 'Th\u00eam Goal',
  loading: '\u0110ang t\u1ea3i goals...',
  empty: 'Ch\u01b0a c\u00f3 goal n\u00e0o. T\u1ea1o goal \u0111\u1ea7u ti\u00ean \u0111\u1ec3 b\u1eaft \u0111\u1ea7u tracking.',
  modalTitle: 'T\u1ea1o goal m\u1edbi',
  errorFallback: 'Kh\u00f4ng t\u1ea3i \u0111\u01b0\u1ee3c danh s\u00e1ch goals.',
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
    if (window.confirm('B\u1ea1n c\u00f3 ch\u1eafc ch\u1eafn mu\u1ed1n x\u00f3a Goal n\u00e0y kh\u00f4ng? To\u00e0n b\u1ed9 Task s\u1ebd b\u1ecb x\u00f3a theo.')) {
      deleteGoal.mutate(id)
    }
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingGoal(null)
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">{LABELS.title}</h2>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
          onClick={() => {
            setEditingGoal(null)
            setModalOpen(true)
          }}
        >
          <Plus size={16} /> {/* Thư viện Icon */}
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

      {!goalsQuery.isLoading && goals.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-4 text-sm text-text-muted">
          {LABELS.empty}
        </p>
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
        title={editingGoal ? 'S\u1eeda Goal' : LABELS.modalTitle}
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
