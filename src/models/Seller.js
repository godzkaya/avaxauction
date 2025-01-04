export class Seller {
  constructor({
    id,
    address,
    name,
    reputationScore,
    totalSales,
    positiveReviews,
    negativeReviews,
    reviews,
    joinedAt
  }) {
    this.id = id
    this.address = address
    this.name = name
    this.reputationScore = reputationScore // 0-100 arası puan
    this.totalSales = totalSales
    this.positiveReviews = positiveReviews
    this.negativeReviews = negativeReviews
    this.reviews = reviews || []
    this.joinedAt = joinedAt || new Date()
  }
} 