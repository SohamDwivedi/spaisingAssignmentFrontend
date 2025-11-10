import productsReducer, { fetchProducts } from "../features/products/productsSlice";
import { AnyAction } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  loading: false,
  error: null,
  meta: null,
};

describe("products slice", () => {
  it("should return the initial state", () => {
    expect(productsReducer(undefined, {} as AnyAction)).toEqual(initialState);
  });

  it("should set loading to true when pending", () => {
    const action = { type: fetchProducts.pending.type };
    const state = productsReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it("should store products and meta when fulfilled", () => {
    const action = {
      type: fetchProducts.fulfilled.type,
      payload: {
        data: [{ id: 1, name: "Test Product", price: 100 }],
        meta: { current_page: 1, last_page: 1, total: 1 },
      },
    };
    const state = productsReducer(initialState, action);
    expect(state.list).toHaveLength(1);
    expect(state.meta).toEqual({ current_page: 1, last_page: 1, total: 1 });
    expect(state.loading).toBe(false);
  });

  it("should handle errors when rejected", () => {
    const action = {
      type: fetchProducts.rejected.type,
      error: { message: "Failed to fetch" },
    };
    const state = productsReducer(initialState, action);
    expect(state.error).toBe("Failed to fetch");
    expect(state.loading).toBe(false);
  });
});
