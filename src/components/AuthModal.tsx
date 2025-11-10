import React, { useState } from "react";
import axiosClient from "../api/axiosClient";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isLogin
        ? "/auth/login"
        : "/auth/register";

      const payload = isLogin
        ? { email: form.email, password: form.password }
        : { name: form.name, email: form.email, password: form.password };

      const res = await axiosClient.post(endpoint, payload);
      const { token, user } = res.data;

      // Save token and user info
      localStorage.setItem("token", token);
      window.dispatchEvent(new Event("tokenUpdated"));
      localStorage.setItem("role", user?.role || "user");
      localStorage.setItem("user", JSON.stringify(user));

      // check for pending Add-to-Cart
      const pendingCart = localStorage.getItem("pendingAddToCart");
      if (pendingCart!==null && user?.role==="user") {
        const { productId, quantity } = JSON.parse(pendingCart);

        try {
          await axiosClient.post("/cart", {
            product_id: productId,
            quantity,
          });

          // cleanup after successful cart update
          localStorage.removeItem("pendingAddToCart");
          
          // refresh cart count in navbar if available
          setTimeout(() => {
            if ((window as any).updateCartCount) {
              (window as any).updateCartCount();
            }
          }, 300);

          
          setTimeout(() => {
            if (onSuccess) onSuccess();
            onClose();
          }, 500)

          return; // stop further redirects
        } catch (cartError) {
          console.error("Pending AddToCart failed:", cartError);
        }
      }

      if(user?.role=='user'){
        setTimeout(() => {
            if ((window as any).updateCartCount) {
              (window as any).updateCartCount();
            }
        }, 300);
      }

      if(user?.role=='admin'){
        localStorage.removeItem("pendingAddToCart");
        navigate("/admin");
       
      }

      // normal post-login flow
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 500)


    } catch (err: any) {
      let message = "Something went wrong.";

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        message = Object.values(errors).flat().join(" ");
      } else if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.response?.data?.error) {
        message = err.response.data.error;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
      <div className="bg-[#111] text-white w-[400px] p-8 rounded-2xl shadow-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center text-purple-400">
          {isLogin ? "Login" : "Sign Up"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="p-3 bg-gray-800 rounded focus:outline-none"
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="p-3 bg-gray-800 rounded focus:outline-none"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="p-3 bg-gray-800 rounded focus:outline-none"
            required
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold transition-all"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-gray-400 text-sm mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={toggleMode}
            className="text-purple-400 hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

if (typeof window !== "undefined") {
  window.showAuthModal = () => {
    const modalEvent = new CustomEvent("open-auth-modal");
    window.dispatchEvent(modalEvent);
  };
}

export default AuthModal;


