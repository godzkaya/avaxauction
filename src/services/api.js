import axios from 'axios'

const api = {
  async getProducts() {
    const response = await axios.get('/api/products')
    return response.data
  },

  async createProduct(productData) {
    const response = await axios.post('/api/products', productData)
    return response.data
  },

  async placeBid(productId, bidData) {
    const response = await axios.post(`/api/products/${productId}/bid`, bidData)
    return response.data
  },

  async getSellerReputation(sellerId) {
    const response = await axios.get(`/api/sellers/${sellerId}/reputation`)
    return response.data
  }
}

export default api 