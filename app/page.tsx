'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Ledger from '@/components/Ledger'
import BudgetPlanner from '@/components/BudgetPlanner'
import MonthlySummary from '@/components/MonthlySummary'
import SavingsGoals from '@/components/SavingsGoals'
import CategoriesManager from '@/components/CategoriesManager'

import {
  loadFromStorage,
  saveTransaction,
  deleteTransaction,
  saveBudget,
  saveCategory,
  deleteCategory,
  saveSavingsGoal,
  deleteSavingsGoal,
  saveMonthlyNote,
} from '@/lib/storage'

import type {
  Transaction,
  Budget,
  Category,
  SavingsGoal,
  MonthlyNote,
} from '@/lib/types'

export default function Home() {
  const [activeTab, setActiveTab] = useState('ledger')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [budget, setBudget] = useState<Budget | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [monthlyNotes, setMonthlyNotes] = useState<MonthlyNote[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  /* =========================
     INITIAL LOAD
  ========================= */
  useEffect(() => {
    async function init() {
      const data = await loadFromStorage()
      setTransactions(data.transactions)
      setBudget(data.budget)
      setCategories(data.categories)
      setSavingsGoals(data.savingsGoals)
      setMonthlyNotes(data.monthlyNotes)
      setIsLoaded(true)
    }

    init()
  }, [])

  /* =========================
     TRANSACTIONS
  ========================= */
  const handleAddTransaction = async (
    transaction: Omit<Transaction, 'id'>
  ) => {
    const saved = await saveTransaction(transaction)
    setTransactions([saved, ...transactions])
  }

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id)
    setTransactions(transactions.filter((t) => t._id !== id))
  }

  /* =========================
     BUDGET
  ========================= */
  const handleUpdateBudget = async (newBudget: Budget) => {
    const saved = await saveBudget(newBudget)
    setBudget(saved)
  }

  /* =========================
     CATEGORIES
  ========================= */
  const handleAddCategory = async (category: Category) => {
    const saved = await saveCategory(category)
    setCategories([...categories, saved])
  }

  const handleDeleteCategory = async (id: string) => {
    await deleteCategory(id)
    setCategories(categories.filter((c) => c._id !== id))
  }

  /* =========================
     SAVINGS GOALS
  ========================= */
  const handleAddGoal = async (goal: Omit<SavingsGoal, 'id'>) => {
    const saved = await saveSavingsGoal(goal)
    setSavingsGoals([...savingsGoals, saved])
  }

  const handleUpdateGoal = async (
    id: string,
    updates: Partial<SavingsGoal>
  ) => {
    const updated = savingsGoals.map((g) =>
      g._id === id ? { ...g, ...updates } : g
    )
    setSavingsGoals(updated)
  }

  const handleDeleteGoal = async (id: string) => {
    await deleteSavingsGoal(id)
    setSavingsGoals(savingsGoals.filter((g) => g._id !== id))
  }

  /* =========================
     MONTHLY NOTES
  ========================= */
  const handleSaveMonthlyNote = async (date: string, note: MonthlyNote) => {
    await saveMonthlyNote({ ...note, date })
    setMonthlyNotes(
      monthlyNotes.filter((n) => n.date !== date).concat([{ ...note, date }])
    )
  }

  /* =========================
     LOADING STATE
  ========================= */
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          <p className="mt-4 text-muted-foreground">Loading your ledger...</p>
        </div>
      </div>
    )
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold">Ledger</h1>
          <p className="text-sm text-muted-foreground">
            Personal Finance Tracking
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="ledger">Ledger</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="goals">Goals</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>

          <TabsContent value="ledger">
            <Ledger
              transactions={transactions}
              categories={categories}
              onAddTransaction={handleAddTransaction}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </TabsContent>

          <TabsContent value="budget">
            <BudgetPlanner
              budget={budget}
              categories={categories}
              transactions={transactions}
              onUpdateBudget={handleUpdateBudget}
            />
          </TabsContent>

          <TabsContent value="summary">
            <MonthlySummary
              transactions={transactions}
              budget={budget}
              monthlyNotes={monthlyNotes}
              onSaveNote={handleSaveMonthlyNote}
            />
          </TabsContent>

          <TabsContent value="goals">
            <SavingsGoals
              goals={savingsGoals}
              onAddGoal={handleAddGoal}
              onUpdateGoal={handleUpdateGoal}
              onDeleteGoal={handleDeleteGoal}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoriesManager
              categories={categories}
              onAddCategory={handleAddCategory}
              onDeleteCategory={handleDeleteCategory}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
