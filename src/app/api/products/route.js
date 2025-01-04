import { redisService } from '../../../services/redis'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const products = await redisService.getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error('GET products error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const productData = await request.json()
    console.log('Received product data:', productData) // Debug için

    const product = await redisService.saveProduct(productData)
    console.log('Saved product:', product) // Debug için

    return NextResponse.json(product)
  } catch (error) {
    console.error('POST product error:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
} 