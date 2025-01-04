export class Product {
  constructor({
    id,
    title,
    description,
    price,
    paymentToken,
    quantity,
    images,
    sellerId,
    isAuction,
    auctionStartDate,
    auctionEndDate,
    currentBid,
    currentBidToken,
    status
  }) {
    this.id = id
    this.title = title
    this.description = description
    this.price = price
    this.paymentToken = paymentToken
    this.quantity = quantity
    this.images = images
    this.sellerId = sellerId
    this.isAuction = isAuction
    this.auctionStartDate = auctionStartDate
    this.auctionEndDate = auctionEndDate
    this.currentBid = currentBid
    this.currentBidToken = currentBidToken
    this.status = status
    this.createdAt = new Date()
  }
} 