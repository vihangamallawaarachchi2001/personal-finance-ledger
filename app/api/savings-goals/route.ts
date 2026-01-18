import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SavingsGoal from '@/models/SavingsGoal'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const goal = await SavingsGoal.create(body)
  return NextResponse.json(goal)
}

export async function DELETE(req: Request) {
  await connectDB()
  const { id } = await req.json()
  await SavingsGoal.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
