import type { AppData } from './types'

/* =========================
   LOAD ALL DATA
========================= */
export async function loadFromStorage(): Promise<AppData> {
  const res = await fetch('/api/app-data', {
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to load app data')
  }

  return res.json()
}

/* =========================
   TRANSACTIONS
========================= */
export async function saveTransaction(transaction: any) {
  const res = await fetch('/api/transactions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  })

  return res.json()
}

export async function deleteTransaction(id: string) {
  await fetch('/api/transactions', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}

/* =========================
   CATEGORIES
========================= */
export async function saveCategory(category: any) {
  const res = await fetch('/api/categories', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(category),
  })

  return res.json()
}

export async function deleteCategory(id: string) {
  await fetch('/api/categories', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}

/* =========================
   BUDGET
========================= */
export async function saveBudget(budget: any) {
  const res = await fetch('/api/budget', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(budget),
  })

  return res.json()
}

/* =========================
   SAVINGS GOALS
========================= */
export async function saveSavingsGoal(goal: any) {
  const res = await fetch('/api/savings-goals', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goal),
  })

  return res.json()
}

export async function deleteSavingsGoal(id: string) {
  await fetch('/api/savings-goals', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
}

/* =========================
   MONTHLY NOTES
========================= */
export async function saveMonthlyNote(note: any) {
  await fetch('/api/monthly-notes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(note),
  })
}
