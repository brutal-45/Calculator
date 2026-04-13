import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET - Fetch all calculations
export async function GET() {
  try {
    const calculations = await db.calculation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
    return NextResponse.json(calculations)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch calculations' }, { status: 500 })
  }
}

// POST - Create new calculation
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { expression, result, exactForm, mode } = body

    if (!expression || !result) {
      return NextResponse.json({ error: 'Expression and result are required' }, { status: 400 })
    }

    const calculation = await db.calculation.create({
      data: { expression, result, exactForm: exactForm || null, mode: mode || 'basic' },
    })

    return NextResponse.json(calculation, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create calculation' }, { status: 500 })
  }
}

// DELETE - Clear all calculations
export async function DELETE() {
  try {
    await db.calculation.deleteMany()
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed to clear calculations' }, { status: 500 })
  }
}
