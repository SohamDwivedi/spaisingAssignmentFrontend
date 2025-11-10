import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  id: number;
  name: string;
  price: number | string;
  quantity: number;
  description:string;
  image: string;
}

interface CartState {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
}

const initialState: CartState = {
  items: [],
  totalQuantity: 0,
  totalPrice:0
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
        console.log(action.payload);
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );

      const itemPrice = Number(String(action.payload.price).replace(/,/g, "")) || 0;

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push({
          ...action.payload,
          price: itemPrice,
          quantity: action.payload.quantity || 1,
        });
      }

      state.totalQuantity = state.items.reduce(
        (sum, item) => sum + item.quantity,
        0
      );

      state.totalPrice = state.items.reduce(
        (sum, item) => sum +( Number(String(item.price).replace(/,/g, "")) * item.quantity),
        0
      );
      console.log(state.totalQuantity,state.totalPrice,state.items);
    },

    removeFromCart: (state, action: PayloadAction<number>) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
        state.totalQuantity = state.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        state.totalPrice = state.items.reduce(
            (sum, item) => sum + (Number(String(item.price).replace(/,/g, ""))*item.quantity),
            0
        );
    },

    decreaseFromCart: (state, action: PayloadAction<number>) => {
      const item = state.items.find((i) => i.id === action.payload);

      if (!item) return;

      if (item.quantity > 1) {
        item.quantity -= 1;
      } else {
        state.items = state.items.filter((i) => i.id !== action.payload);
      }

      state.totalQuantity = state.items.reduce(
        (sum, i) => sum + i.quantity,
        0
      );
      state.totalPrice = state.items.reduce(
        (sum, i) => sum + (Number(String(i.price).replace(/,/g, "")) * i.quantity),
        0
      );
    },
    clearCart: (state) => {
        state.items = [];
        state.totalQuantity = 0;
        state.totalPrice = 0;
    },
  },
});

export const { addToCart, removeFromCart, clearCart,decreaseFromCart } = cartSlice.actions;
export default cartSlice.reducer;
