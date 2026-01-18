'use client'

import React from "react"

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
import type { Transaction, Category } from '@/lib/types'
import { calculateRunningBalance, formatCurrency, formatDate, getTotalIncome, getTotalExpense, getMonthTransactions } from '@/lib/calculations'

interface LedgerProps {
  transactions: Transaction[]
  categories: Category[]
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void
  onDeleteTransaction: (id: string) => void
}

export default function Ledger({
  transactions,
  categories,
  onAddTransaction,
  onDeleteTransaction,
}: LedgerProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [income, setIncome] = useState('')
  const [expense, setExpense] = useState('')

  const monthTransactions = getMonthTransactions(transactions)
  const currentBalance = calculateRunningBalance(monthTransactions)
  const totalIncome = getTotalIncome(monthTransactions)
  const totalExpense = getTotalExpense(monthTransactions)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !category || (!income && !expense)) {
      alert('Please fill in all fields')
      return
    }

    onAddTransaction({
      date,
      description,
      category,
      income: income ? parseFloat(income) : undefined,
      expense: expense ? parseFloat(expense) : undefined,
    })

    setDate(new Date().toISOString().split('T')[0])
    setDescription('')
    setCategory('')
    setIncome('')
    setExpense('')
  }

  let balanceTracker = 0
  const transactionsWithBalance = monthTransactions
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map((t) => {
      balanceTracker += (t.income || 0) - (t.expense || 0)
      return { ...t, balance: balanceTracker }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Income</p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(totalIncome)}
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-muted-foreground mb-1">Total Expenses</p>
          <p className="text-2xl font-semibold text-foreground">
            {formatCurrency(totalExpense)}
          </p>
        </Card>
        <Card className="p-6 border-2 border-primary bg-primary/5">
          <p className="text-sm text-muted-foreground mb-1">Current Balance</p>
          <p className="text-2xl font-semibold text-primary">
            {formatCurrency(currentBalance)}
          </p>
        </Card>
      </div>

      {/* Add Transaction Form */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Add Entry</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Date
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-muted border-border">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat._id} value={cat.name}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              Description
            </label>
            <Input
              type="text"
              placeholder="e.g., Grocery shopping"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-muted border-border"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Income
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={income}
                onChange={(e) => {
                  setIncome(e.target.value)
                  if (e.target.value) setExpense('')
                }}
                step="0.01"
                min="0"
                className="bg-muted border-border"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Expense
              </label>
              <Input
                type="number"
                placeholder="0.00"
                value={expense}
                onChange={(e) => {
                  setExpense(e.target.value)
                  if (e.target.value) setIncome('')
                }}
                step="0.01"
                min="0"
                className="bg-muted border-border"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        </form>
      </Card>

      {/* Transactions Table */}
      <Card className="p-6 overflow-x-auto">
        <h2 className="text-lg font-semibold text-foreground mb-4">This Month</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-foreground font-semibold">
                Date
              </th>
              <th className="text-left py-3 px-2 text-foreground font-semibold">
                Description
              </th>
              <th className="text-left py-3 px-2 text-foreground font-semibold">
                Category
              </th>
              <th className="text-right py-3 px-2 text-foreground font-semibold">
                Income
              </th>
              <th className="text-right py-3 px-2 text-foreground font-semibold">
                Expense
              </th>
              <th className="text-right py-3 px-2 text-foreground font-semibold">
                Balance
              </th>
              <th className="text-center py-3 px-2"></th>
            </tr>
          </thead>
          <tbody>
            {transactionsWithBalance.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-muted-foreground">
                  No transactions yet. Start by adding an entry.
                </td>
              </tr>
            ) : (
              transactionsWithBalance.map((t) => (
                <tr
                  key={t._id}
                  className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <td className="py-3 px-2 text-foreground">
                    {formatDate(t.date)}
                  </td>
                  <td className="py-3 px-2 text-foreground">{t.description}</td>
                  <td className="py-3 px-2 text-foreground">{t.category}</td>
                  <td className="py-3 px-2 text-right text-foreground">
                    {t.income ? formatCurrency(t.income) : '-'}
                  </td>
                  <td className="py-3 px-2 text-right text-foreground">
                    {t.expense ? formatCurrency(t.expense) : '-'}
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-primary">
                    {formatCurrency(t.balance)}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <button
                      onClick={() => onDeleteTransaction(t._id as string)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                      title="Delete entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
