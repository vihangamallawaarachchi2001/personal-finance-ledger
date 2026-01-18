'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'
import type { SavingsGoal } from '@/lib/types'
import { formatCurrency } from '@/lib/calculations'

interface SavingsGoalsProps {
  goals: SavingsGoal[]
  onAddGoal: (goal: Omit<SavingsGoal, 'id'>) => void
  onUpdateGoal: (id: string, updates: Partial<SavingsGoal>) => void
  onDeleteGoal: (id: string) => void
}

export default function SavingsGoals({
  goals,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}: SavingsGoalsProps) {
  const [name, setName] = useState('')
  const [targetAmount, setTargetAmount] = useState('')

  const handleAddGoal = () => {
    if (!name || !targetAmount) {
      alert('Please fill in all fields')
      return
    }

    onAddGoal({
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: 0,
    })

    setName('')
    setTargetAmount('')
  }

  const totalSavingsTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0)
  const totalSavings = goals.reduce((sum, g) => sum + g.currentAmount, 0)
  const overallProgress =
    totalSavingsTarget > 0 ? (totalSavings / totalSavingsTarget) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card className="p-6 border-2 border-primary bg-primary/5">
        <p className="text-sm text-muted-foreground mb-2">Total Progress</p>
        <p className="text-3xl font-semibold text-primary mb-2">
          {formatCurrency(totalSavings)} / {formatCurrency(totalSavingsTarget)}
        </p>
        <div className="w-full bg-border rounded-full h-3 overflow-hidden">
          <div
            className="h-full bg-primary transition-all"
            style={{ width: `${Math.min(overallProgress, 100)}%` }}
          ></div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {overallProgress.toFixed(1)}% of total savings target
        </p>
      </Card>

      {/* Add Goal Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Create New Goal
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Goal Name
            </label>
            <Input
              type="text"
              placeholder="e.g., Emergency Fund"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-muted border-border"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Target Amount
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              step="0.01"
              min="0"
              className="bg-muted border-border"
            />
          </div>

          <Button
            onClick={handleAddGoal}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Goal
          </Button>
        </div>
      </Card>

      {/* Goals List */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No savings goals yet. Create one to start tracking your progress!
          </Card>
        ) : (
          goals.map((goal) => {
            const percentage =
              goal.targetAmount > 0
                ? (goal.currentAmount / goal.targetAmount) * 100
                : 0
            const remaining = goal.targetAmount - goal.currentAmount

            return (
              <Card
                key={goal.id}
                className="p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {goal.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(goal.currentAmount)} /{' '}
                      {formatCurrency(goal.targetAmount)}
                    </p>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-border rounded-full h-2 overflow-hidden mb-3">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  ></div>
                </div>

                <div className="flex justify-between text-sm text-foreground mb-4">
                  <span>{percentage.toFixed(1)}% complete</span>
                  <span>
                    {remaining > 0
                      ? `${formatCurrency(remaining)} to go`
                      : 'Goal reached!'}
                  </span>
                </div>

                {/* Update Amount */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground block">
                    Add to Savings
                  </label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Amount"
                      step="0.01"
                      min="0"
                      id={`add-${goal.id}`}
                      className="bg-muted border-border flex-1"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const input = document.getElementById(
                            `add-${goal.id}`
                          ) as HTMLInputElement
                          if (input && input.value) {
                            const amount = parseFloat(input.value)
                            onUpdateGoal(goal.id, {
                              currentAmount: goal.currentAmount + amount,
                            })
                            input.value = ''
                          }
                        }
                      }}
                    />
                    <Button
                      onClick={() => {
                        const input = document.getElementById(
                          `add-${goal.id}`
                        ) as HTMLInputElement
                        if (input && input.value) {
                          const amount = parseFloat(input.value)
                          onUpdateGoal(goal.id, {
                            currentAmount: goal.currentAmount + amount,
                          })
                          input.value = ''
                        }
                      }}
                      className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
