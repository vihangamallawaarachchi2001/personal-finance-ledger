import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { ensureDefaultCategories } from '@/lib/initDefaults'

import Category from '@/models/Category'
import Transaction from '@/models/Transaction'
import Budget from '@/models/Budget'
import SavingsGoal from '@/models/SavingsGoal'
import MonthlyNote from '@/models/MonthlyNote'

export async function GET() {
  await connectDB()
  await ensureDefaultCategories()

  const [
    categories,
    transactions,
    budget,
    savingsGoals,
    monthlyNotes,
  ] = await Promise.all([
    Category.find(),
    Transaction.find(),
    Budget.findOne(),
    SavingsGoal.find(),
    MonthlyNote.find(),
  ])

  return NextResponse.json({
    categories,
    transactions,
    budget,
    savingsGoals,
    monthlyNotes,
  })
}
