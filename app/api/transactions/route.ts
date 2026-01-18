import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Transaction from '@/models/Transaction'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const transaction = await Transaction.create(body)
  return NextResponse.json(transaction)
}

export async function DELETE(req: Request) {
  await connectDB()
  const { id } = await req.json()
  await Transaction.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
