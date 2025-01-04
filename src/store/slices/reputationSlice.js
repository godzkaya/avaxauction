import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

export const fetchSellerReputation = createAsyncThunk(
  'reputation/fetchSellerReputation',
  async (sellerId) => {
    const response = await api.get(`/sellers/${sellerId}/reputation`)
    return response.data
  }
)

export const submitReview = createAsyncThunk(
  'reputation/submitReview',
  async ({ sellerId, productId, rating, comment }) => {
    const response = await api.post(`/sellers/${sellerId}/reviews`, {
      productId,
      rating,
      comment
    })
    return response.data
  }
)

const reputationSlice = createSlice({
  name: 'reputation',
  initialState: {
    sellerReputations: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerReputation.fulfilled, (state, action) => {
        state.sellerReputations[action.payload.sellerId] = action.payload
      })
      .addCase(submitReview.fulfilled, (state, action) => {
        const { sellerId } = action.payload
        if (state.sellerReputations[sellerId]) {
          state.sellerReputations[sellerId] = {
            ...state.sellerReputations[sellerId],
            ...action.payload
          }
        }
      })
  },
})

export default reputationSlice.reducer 