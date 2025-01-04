import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  address: null,
  isConnected: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload
      state.isConnected = !!action.payload
    },
    disconnect: (state) => {
      state.address = null
      state.isConnected = false
    },
  },
})

export const { setAddress, disconnect } = authSlice.actions
export default authSlice.reducer 