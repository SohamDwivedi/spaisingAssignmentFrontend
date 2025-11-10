import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axiosClient from "../api/axiosClient";

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchCart = async (check:boolean=false) => {
    try {
      const res = await axiosClient.get("http://localhost:8000/api/cart");
      setCart(res.data.cart || []);
    } catch {
      setCart([]);
    } finally {
      setLoading(false);
      if(check){
        if (window.updateCartCount) window.updateCartCount();
        navigate('/');
      }
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    setLoading(true);
    try {
      await axiosClient.patch(
        `http://localhost:8000/api/cart/items/${productId}`,
        { quantity }
      );
      
      fetchCart();
      if (window.updateCartCount) window.updateCartCount();
    } catch (err) {
      setLoading(false);
      Swal.fire("Error", "Failed to update quantity", "error");
    } 
  };

  const removeItem = async (productId: number) => {
    setLoading(true);
    try {
      await axiosClient.delete(`http://localhost:8000/api/cart/items/${productId}`);
      fetchCart();
      if (window.updateCartCount) window.updateCartCount();
    } catch {
      setLoading(false);
      Swal.fire("Error", "Failed to remove item", "error");
    } 
  };

  useEffect(() => {
    if (token) fetchCart();
  }, []);

  if (!token)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f0f10] text-white">
        <h2 className="text-3xl font-semibold mb-4">Login to view your cart</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700"
        >
          Go Home
        </button>
      </div>
    );

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh] text-white">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  if (cart.length === 0)
    return (
      <div className="min-h-screen bg-[#0f0f10] flex flex-col items-center justify-center text-white">
        <h2 className="text-3xl font-semibold mb-4">Your Cart is Empty 🛒</h2>
        <button
          onClick={() => navigate("/")}
          className="bg-purple-600 px-6 py-3 rounded-lg hover:bg-purple-700 transition-all"
        >
          Go Shopping
        </button>
      </div>
    );

  const total = cart.reduce(
    (sum, item) => sum + Number(item.product.price) * item.quantity,
    0
  );

  const totalItem = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await axiosClient.post("http://localhost:8000/api/checkout");
      Swal.fire({
        icon: "success",
        title: "Checkout Successful!",
        text: res.data.message || "Your order has been placed successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
      fetchCart(true);
      
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "Checkout Failed",
        text:
          err.response?.data?.message ||
          "Something went wrong during checkout. Please try again.",
      });
      setLoading(false);
    } 
  };


  return (
    <main className="min-h-screen bg-[#0f0f10] text-white p-10">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-bold text-purple-400">Shopping Cart</h1>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 transition-all"
        >
          Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Items */}
        <div className="flex-1 space-y-8">
          {cart.map((item) => (
            <div
              key={item.product_id}
              className="flex flex-col md:flex-row gap-6 p-5 bg-gray-900 rounded-xl"
            >
              <img
                src={JSON.parse(item.product.images)[0]}
                alt={item.product.name}
                className="w-32 h-32 object-cover rounded-md"
              />

              <div className="flex flex-col flex-1">
                <h3 className="text-xl font-semibold">{item.product.name}</h3>
                <p className="text-gray-400 mt-1">{item.product.description}</p>

                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() =>
                      item.quantity > 1 &&
                      updateQuantity(item.product_id, item.quantity - 1)
                    }
                    className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      updateQuantity(item.product_id, item.quantity + 1)
                    }
                    className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
                  >
                    +
                  </button>

                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="flex items-center gap-1 text-red-400 hover:text-red-500 ml-4"
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                </div>
              </div>

              <div className="text-right md:w-32">
                <p className="text-lg font-semibold text-purple-400">
                  ₹{item.product.price * item.quantity}
                </p>
                <p className="text-sm text-gray-400">
                  ₹{item.product.price}/unit
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:w-1/3 bg-gray-900 rounded-xl p-6 h-fit">
          <h2 className="text-2xl font-semibold mb-6 text-purple-400">
            Order Summary
          </h2>
          <div className="flex justify-between mb-3 text-gray-300">
            <span>Total Items:</span>
            <span>{totalItem}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold text-white mb-6">
            <span>Total Price:</span>
            <span>₹{total}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </main>
  );
};

export default Cart;
