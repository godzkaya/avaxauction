import { Redis } from 'ioredis'

// Redis bağlantısını sadece server-side'da oluştur
let redis
if (typeof window === 'undefined') {
  redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379,
  })
}

export const redisService = {
  // Ürün işlemleri
  async saveProduct(product) {
    try {
      const id = `product:${Date.now()}`
      product.id = id
      
      // Object'i string'e çevir
      const productToSave = Object.entries(product).reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'object' ? JSON.stringify(value) : String(value)
        return acc
      }, {})

      // Redis'e kaydet
      await redis.hmset(id, productToSave)
      await redis.sadd('products', id)
      
      return {
        ...product,
        price: parseFloat(product.price),
        quantity: parseInt(product.quantity),
        isAuction: Boolean(product.isAuction)
      }
    } catch (error) {
      console.error('Redis saveProduct error:', error)
      throw error
    }
  },

  async getProducts() {
    try {
      const productIds = await redis.smembers('products')
      const products = await Promise.all(
        productIds.map(async (id) => {
          const product = await redis.hgetall(id)
          return {
            ...product,
            price: parseFloat(product.price),
            quantity: parseInt(product.quantity),
            isAuction: product.isAuction === 'true',
            currentBid: product.currentBid ? parseFloat(product.currentBid) : null,
            images: product.images ? JSON.parse(product.images) : []
          }
        })
      )
      return products
    } catch (error) {
      console.error('Redis getProducts error:', error)
      throw error
    }
  },

  // Açık artırma işlemleri
  async placeBid(productId, bidAmount) {
    const product = await redis.hgetall(productId)
    if (parseFloat(bidAmount) <= parseFloat(product.currentBid || 0)) {
      throw new Error('Bid amount must be higher than current bid')
    }
    await redis.hset(productId, 'currentBid', bidAmount)
    return { ...product, currentBid: bidAmount }
  },

  // Satıcı itibar işlemleri
  async getSellerReputation(sellerId) {
    const reputation = await redis.hgetall(`seller:${sellerId}`)
    if (!Object.keys(reputation).length) {
      // Yeni satıcı için varsayılan değerler
      const defaultReputation = {
        reputationScore: '100',
        totalSales: '0',
        positiveReviews: '0',
        negativeReviews: '0',
        reviews: '[]'
      }
      await redis.hset(`seller:${sellerId}`, defaultReputation)
      return defaultReputation
    }
    return {
      ...reputation,
      reviews: JSON.parse(reputation.reviews || '[]')
    }
  }
} 