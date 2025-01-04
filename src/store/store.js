import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import productReducer from './slices/productSlice'
import reputationReducer from './slices/reputationSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    reputation: reputationReducer,
  },
}) 