import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Category from '@/models/Category'

export async function POST(req: Request) {
  await connectDB()
  const body = await req.json()
  const category = await Category.create(body)
  return NextResponse.json(category)
}

export async function DELETE(req: Request) {
  await connectDB()
  const { id } = await req.json()
  await Category.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
