import { configureStore, createSlice } from '@reduxjs/toolkit';

// Example: products slice
const productsSlice = createSlice({
  name: 'products',
  initialState: { items: [] },
  reducers: {
    setProducts: (state, action) => {
      state.items = action.payload;
    },
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    updateProduct: (state, action) => {
      const idx = state.items.findIndex(p => p.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(p => p.id !== action.payload);
    },
  },
});

export const { setProducts, addProduct, updateProduct, deleteProduct } = productsSlice.actions;

export const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    // Add more slices here as needed
  },
});
