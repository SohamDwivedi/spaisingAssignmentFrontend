import React from "react";
import { renderHook } from "@testing-library/react";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import { useFetchProducts } from "./useFetchProducts";

// ✅ FIX: Import redux-thunk correctly (works in both ESM & CJS)
const thunk = require("redux-thunk").default || require("redux-thunk").thunk || require("redux-thunk");
const mockStore = configureMockStore([thunk]);

describe("useFetchProducts hook", () => {
  it("dispatches fetchProducts on mount", () => {
    const store = mockStore({
      products: { list: [], loading: false, error: null },
    });

    const Wrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
      <Provider store={store}>{children}</Provider>
    );

    renderHook(() => useFetchProducts(1), { wrapper: Wrapper });

    const actions = store.getActions();
    expect(actions.length).toBeGreaterThan(0);
    expect(actions[0].type).toContain("products/fetch/pending");
  });
});
