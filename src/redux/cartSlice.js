import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    total: 0,
    count: 0
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload.items
      state.total = action.payload.total
      state.count = action.payload.items.length
    },
    clearCart: (state) => {
      state.items = []
      state.total = 0
      state.count = 0
    }
  }
})

export const { setCart, clearCart } = cartSlice.actions
export default cartSlice.reducer