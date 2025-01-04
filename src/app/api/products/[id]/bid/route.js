import { redisService } from '../../../../../services/redis'
import { NextResponse } from 'next/server'

export async function POST(request, { params }) {
  try {
    const { bidAmount } = await request.json()
    const product = await redisService.placeBid(params.id, bidAmount)
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 