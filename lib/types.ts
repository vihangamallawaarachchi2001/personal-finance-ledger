export interface Transaction {
  _id?: string
  date: string
  description: string
  category: string
  income?: number
  expense?: number
}

export interface Category {
  _id: string
  name: string
  color?: string
}

export interface BudgetCategory {
  category: string
  limit: number
}

export interface Budget {
  monthYear: string // "2024-01" format
  expectedIncome: number
  categories: BudgetCategory[]
  savingsTarget: number
}

export interface SavingsGoal {
  _id: string
  name: string
  targetAmount: number
  currentAmount: number
}

export interface MonthlyNote {
  date: string // "2024-01" format
  notes: string
  reflection: string
}

export interface AppData {
  transactions: Transaction[]
  budget: Budget | null
  categories: Category[]
  savingsGoals: SavingsGoal[]
  monthlyNotes: MonthlyNote[]
}
