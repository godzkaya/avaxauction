import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await api.get('/products')
    return response.data
  }
)

export const placeBid = createAsyncThunk(
  'products/placeBid',
  async ({ productId, bidAmount }) => {
    const response = await api.post(`/products/${productId}/bid`, { bidAmount })
    return response.data
  }
)

export const buyProduct = createAsyncThunk(
  'products/buyProduct',
  async ({ productId, quantity }) => {
    const response = await api.post(`/products/${productId}/buy`, { quantity })
    return response.data
  }
)

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData) => {
    const response = await api.createProduct(productData)
    return response
  }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
  },
})

export default productSlice.reducer 