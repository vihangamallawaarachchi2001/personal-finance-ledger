import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Budget from '@/models/Budget'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  // One budget per app → overwrite
  await Budget.deleteMany()
  const budget = await Budget.create(body)

  return NextResponse.json(budget)
}
