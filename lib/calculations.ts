import type { Transaction, Budget } from './types'

export function getMonthYear(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getMonthTransactions(transactions: Transaction[], monthYear?: string): Transaction[] {
  const target = monthYear || getMonthYear()
  return transactions.filter((t) => t.date.startsWith(target))
}

export function calculateRunningBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, t) => {
    const income = t.income || 0
    const expense = t.expense || 0
    return acc + income - expense
  }, 0)
}

export function calculateCategoryTotal(
  transactions: Transaction[],
  category: string,
  type: 'income' | 'expense'
): number {
  return transactions
    .filter((t) => t.category === category)
    .reduce((sum, t) => {
      if (type === 'income') return sum + (t.income || 0)
      return sum + (t.expense || 0)
    }, 0)
}

export function getTotalIncome(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + (t.income || 0), 0)
}

export function getTotalExpense(transactions: Transaction[]): number {
  return transactions.reduce((sum, t) => sum + (t.expense || 0), 0)
}

export function getNetSavings(transactions: Transaction[]): number {
  return getTotalIncome(transactions) - getTotalExpense(transactions)
}

export function getTopSpendingCategory(
  transactions: Transaction[]
): { category: string; amount: number } | null {
  const categoryTotals = new Map<string, number>()

  transactions.forEach((t) => {
    if (t.expense) {
      categoryTotals.set(
        t.category,
        (categoryTotals.get(t.category) || 0) + t.expense
      )
    }
  })

  if (categoryTotals.size === 0) return null

  let maxCategory = ''
  let maxAmount = 0

  categoryTotals.forEach((amount, category) => {
    if (amount > maxAmount) {
      maxAmount = amount
      maxCategory = category
    }
  })

  return { category: maxCategory, amount: maxAmount }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(dateString: string): string {
  const [year, month, day] = dateString.split('-')
  return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function formatMonthYear(monthYear: string): string {
  const [year, month] = monthYear.split('-')
  return new Date(`${year}-${month}-01`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
  })
}
