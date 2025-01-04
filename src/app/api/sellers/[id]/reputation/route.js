import { redisService } from '../../../../../services/redis'
import { NextResponse } from 'next/server'

export async function GET(request, { params }) {
  try {
    const reputation = await redisService.getSellerReputation(params.id)
    return NextResponse.json(reputation)
  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 