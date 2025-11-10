import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";
import { Product } from "./productTypes";


interface Meta {
  current_page: number;
  last_page: number;
  total?: number;
}

interface ProductsState {
  list: Product[];
  loading: boolean;
  error: string | null;
  meta: Meta | null;
}

const initialState: ProductsState = {
  list: [],
  loading: false,
  error: null,
  meta: null,
};

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (page: number) => {
    const response = await axiosClient.get(`/public/products?page=${page}`);
    return {
      data: response.data.data,
      meta: response.data.meta,
    };
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchProducts.fulfilled,
        (state, action: PayloadAction<{ data: Product[]; meta: Meta }>) => {
          state.loading = false;
          state.list = action.payload.data;
          state.meta = action.payload.meta;
        }
      )
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error fetching products";
      });
  },
});

export default productsSlice.reducer;
