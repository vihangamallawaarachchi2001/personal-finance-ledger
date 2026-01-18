'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Trash2, Plus } from 'lucide-react'
import type { Budget, Category, Transaction } from '@/lib/types'
import {
  formatCurrency,
  getMonthYear,
  getMonthTransactions,
  calculateCategoryTotal,
} from '@/lib/calculations'

interface BudgetPlannerProps {
  budget: Budget | null
  categories: Category[]
  transactions: Transaction[]
  onUpdateBudget: (budget: Budget) => void
}

export default function BudgetPlanner({
  budget,
  categories,
  transactions,
  onUpdateBudget,
}: BudgetPlannerProps) {
  const monthYear = getMonthYear()
  const monthTransactions = getMonthTransactions(transactions, monthYear)
  const [expectedIncome, setExpectedIncome] = useState(
    budget?.expectedIncome.toString() || ''
  )
  const [savingsTarget, setSavingsTarget] = useState(
    budget?.savingsTarget.toString() || ''
  )
  const [categoryLimit, setCategoryLimit] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  const currentBudget = budget && budget.monthYear === monthYear ? budget : null

  const handleAddCategoryBudget = () => {
    if (!selectedCategory || !categoryLimit) {
      alert('Please select a category and enter a limit')
      return
    }

    const newBudget: Budget = {
      monthYear,
      expectedIncome: parseFloat(expectedIncome) || 0,
      categories: [
        ...(currentBudget?.categories || []).filter(
          (c) => c.category !== selectedCategory
        ),
        { category: selectedCategory, limit: parseFloat(categoryLimit) },
      ],
      savingsTarget: parseFloat(savingsTarget) || 0,
    }

    onUpdateBudget(newBudget)
    setCategoryLimit('')
    setSelectedCategory('')
  }

  const handleRemoveCategory = (categoryName: string) => {
    if (!currentBudget) return

    const newBudget: Budget = {
      ...currentBudget,
      categories: currentBudget.categories.filter((c) => c.category !== categoryName),
    }

    onUpdateBudget(newBudget)
  }

  const handleSaveMainBudget = () => {
    if (!expectedIncome && !savingsTarget) {
      alert('Please enter at least one value')
      return
    }

    const newBudget: Budget = {
      monthYear,
      expectedIncome: parseFloat(expectedIncome) || 0,
      categories: currentBudget?.categories || [],
      savingsTarget: parseFloat(savingsTarget) || 0,
    }

    onUpdateBudget(newBudget)
  }

  return (
    <div className="space-y-6">
      {/* Income & Savings Targets */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Monthly Targets
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Expected Income
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={expectedIncome}
              onChange={(e) => setExpectedIncome(e.target.value)}
              step="0.01"
              min="0"
              className="bg-muted border-border"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Savings Target
            </label>
            <Input
              type="number"
              placeholder="0.00"
              value={savingsTarget}
              onChange={(e) => setSavingsTarget(e.target.value)}
              step="0.01"
              min="0"
              className="bg-muted border-border"
            />
          </div>
        </div>
        <Button
          onClick={handleSaveMainBudget}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Save Targets
        </Button>
      </Card>

      {/* Category Budgets */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          Category Budgets
        </h2>
        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories
                    .filter(
                      (cat) =>
                        !currentBudget?.categories.find(
                          (b) => b.category === cat.name
                        )
                    )
                    .map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Budget Limit
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={categoryLimit}
                onChange={(e) => setCategoryLimit(e.target.value)}
                step="0.01"
                min="0"
                className="bg-muted border-border"
              />
            </div>
          </div>
          <Button
            onClick={handleAddCategoryBudget}
            className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Category Budget
          </Button>
        </div>

        {/* Budget List */}
        <div className="space-y-3">
          {currentBudget && currentBudget.categories.length > 0 ? (
            currentBudget.categories.map((budgetCat) => {
              const actualSpending = calculateCategoryTotal(
                monthTransactions,
                budgetCat.category,
                'expense'
              )
              const percentage =
                budgetCat.limit > 0 ? (actualSpending / budgetCat.limit) * 100 : 0
              const isOverBudget = actualSpending > budgetCat.limit
              const color = isOverBudget ? '#FF6B6B' : '#6BCB77'

              return (
                <div
                  key={budgetCat.category}
                  className="p-4 bg-muted rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-foreground">
                      {budgetCat.category}
                    </span>
                    <button
                      onClick={() => handleRemoveCategory(budgetCat.category)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm text-foreground">
                      <span>
                        {formatCurrency(actualSpending)} / {formatCurrency(budgetCat.limit)}
                      </span>
                      <span className={isOverBudget ? 'text-destructive' : 'text-primary'}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full transition-all"
                        style={{
                          width: `${Math.min(percentage, 100)}%`,
                          backgroundColor: color,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <p className="text-center text-muted-foreground py-6">
              No category budgets set yet
            </p>
          )}
        </div>
      </Card>
    </div>
  )
}
