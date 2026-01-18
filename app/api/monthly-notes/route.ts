import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import MonthlyNote from '@/models/MonthlyNote'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()

  await MonthlyNote.findOneAndUpdate(
    { date: body.date },
    body,
    { upsert: true }
  )

  return NextResponse.json({ success: true })
}
