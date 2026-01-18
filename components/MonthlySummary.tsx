'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { Transaction, Budget, MonthlyNote } from '@/lib/types'
import {
  formatCurrency,
  getMonthYear,
  getMonthTransactions,
  getTotalIncome,
  getTotalExpense,
  getNetSavings,
  getTopSpendingCategory,
  formatMonthYear,
} from '@/lib/calculations'

interface MonthlySummaryProps {
  transactions: Transaction[]
  budget: Budget | null
  monthlyNotes: MonthlyNote[]
  onSaveNote: (date: string, note: MonthlyNote) => void
}

export default function MonthlySummary({
  transactions,
  budget,
  monthlyNotes,
  onSaveNote,
}: MonthlySummaryProps) {
  const monthYear = getMonthYear()
  const monthTransactions = getMonthTransactions(transactions, monthYear)

  const totalIncome = getTotalIncome(monthTransactions)
  const totalExpense = getTotalExpense(monthTransactions)
  const netSavings = getNetSavings(monthTransactions)
  const topCategory = getTopSpendingCategory(monthTransactions)

  const currentNote = monthlyNotes.find((n) => n.date === monthYear)
  const [notes, setNotes] = useState(currentNote?.notes || '')
  const [reflection, setReflection] = useState(currentNote?.reflection || '')

  const handleSave = () => {
    onSaveNote(monthYear, {
      date: monthYear,
      notes,
      reflection,
    })
    alert('Monthly summary saved!')
  }

  const budgetExpectedIncome =
    budget && budget.monthYear === monthYear ? budget.expectedIncome : 0
  const budgetSavingsTarget =
    budget && budget.monthYear === monthYear ? budget.savingsTarget : 0

  const incomeVariance = budgetExpectedIncome - totalIncome
  const savingsVariance = netSavings - budgetSavingsTarget

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Income</p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(totalIncome)}
          </p>
          {budgetExpectedIncome > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Budget: {formatCurrency(budgetExpectedIncome)}
            </p>
          )}
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(totalExpense)}
          </p>
        </Card>

        <Card className="p-6 border-2 border-primary bg-primary/5">
          <p className="text-sm text-muted-foreground mb-1">Net Savings</p>
          <p className="text-2xl font-semibold text-primary">
            {formatCurrency(netSavings)}
          </p>
          {budgetSavingsTarget > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Target: {formatCurrency(budgetSavingsTarget)}
            </p>
          )}
        </Card>

        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Top Spending</p>
          {topCategory ? (
            <>
              <p className="text-2xl font-semibold text-foreground">
                {topCategory.category}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {formatCurrency(topCategory.amount)}
              </p>
            </>
          ) : (
            <p className="text-2xl font-semibold text-muted-foreground">-</p>
          )}
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Expense Breakdown
        </h2>
        <div className="space-y-3">
          {monthTransactions
            .filter((t) => t.expense)
            .reduce((acc, t) => {
              const existing = acc.find((item) => item.category === t.category)
              if (existing) {
                existing.amount += t.expense || 0
              } else {
                acc.push({
                  category: t.category,
                  amount: t.expense || 0,
                })
              }
              return acc
            }, [] as Array<{ category: string; amount: number }>)
            .sort((a, b) => b.amount - a.amount)
            .map((item) => {
              const percentage =
                totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0
              return (
                <div key={item.category} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.category}
                    </span>
                    <span className="text-foreground">
                      {formatCurrency(item.amount)} ({percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
        </div>
      </Card>

      {/* Monthly Reflection */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Monthly Reflection
        </h2>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Notes
            </label>
            <Textarea
              placeholder="Summary of this month's finances..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24 bg-muted border-border text-foreground resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Reflection & Goals for Next Month
            </label>
            <Textarea
              placeholder="What went well? What can I improve? What are my goals for next month?"
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              className="min-h-32 bg-muted border-border text-foreground resize-none"
            />
          </div>

          <Button
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Save Monthly Summary
          </Button>
        </div>
      </Card>
    </div>
  )
}
