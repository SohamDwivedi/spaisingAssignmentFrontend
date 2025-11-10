import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, X } from "lucide-react";
import AuthModal from "./AuthModal";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";

const Navbar = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

  const user = localStorage.getItem("role") ?? null;
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await axiosClient.get("/auth/me");
      setProfile(res.data.user);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    }
  };

  const fetchCartCount = async () => {
    console.log('in nav');
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const res = await axiosClient.get("/cart");
      setCartCount(res.data?.cart?.length || 0);
    } catch (err) {
      console.error("Failed to fetch cart count:", err);
    }
  };
  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", syncToken);
    window.addEventListener("tokenUpdated", syncToken);

    return () => {
      window.removeEventListener("storage", syncToken);
      window.removeEventListener("tokenUpdated", syncToken);
    };
  }, []);
  const handleLogout = () => {
    localStorage.clear();
    setShowProfile(false);
    setShowAuth(false);
    setCartCount(0);
    navigate("/");
  };
  useEffect(() => {
    fetchCartCount();

    // Expose global update function for ProductDetail to call
    (window as any).updateCartCount = fetchCartCount;
  }, [token]);
  useEffect(() => {
    fetchCartCount();

    // Expose global update function for ProductDetail to call
    (window as any).updateCartCount = fetchCartCount;
  }, []);

  return (
    <nav className="bg-gray-900 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      {user !== "admin" && (<Link to="/" className="text-2xl font-bold text-purple-400">
        Demo E-Commerce
      </Link>)}
      {user === "admin" && (<Link to="/admin" className="text-2xl font-bold text-purple-400">
        Admin Panel
      </Link>)}
      <div className="flex items-center gap-6">
        {user === "user" && (
          <Link
            to="/orders"
            className="hover:text-purple-400 transition-colors font-medium"
          >
            My Orders
          </Link>
        )}

        {user !== "admin" && (
          <Link
            to="/cart"
            className="relative hover:text-purple-400 transition-colors"
          >
            <ShoppingCart size={24} />
            {cartCount>0 && (<span className="absolute -top-2 -right-2 bg-purple-500 text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>)}
          </Link>
        )}

        {user !== "admin" && (
          <button
            onClick={() => {
              if(!token){
                setShowAuth(true);
              }else{
                fetchProfile();
                setShowProfile(true);
              }
            }}
            className="bg-purple-600 px-4 py-2 rounded-md font-semibold hover:bg-purple-700 transition-all"
          >
            {token ? "My Account" : "Login / Register"}
          </button>
        )}
        {token && (
          <button 
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md"
          onClick={handleLogout}>
            Logout
          </button>
        )}
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={() => navigate('/')}
          />
        )}
        {showProfile && profile && (
        <div className="absolute right-8 top-16 bg-[#111] border border-gray-700 rounded-xl p-5 w-80 shadow-lg z-50 animate-fadeIn">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xl font-semibold text-purple-400">Profile</h3>
            <button
              onClick={() => setShowProfile(false)}
              className="text-gray-400 hover:text-gray-200"
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-2 text-gray-300">
            <p><span className="font-semibold text-gray-200">Name:</span> {profile.name}</p>
            <p><span className="font-semibold text-gray-200">Email:</span> {profile.email}</p>
            <p className="text-xs text-gray-500">
              Member since: {new Date(profile.created_at).toLocaleString()}
            </p>
          </div>
        </div>
      )}
      </div>
    </nav>
  );
};

export default Navbar;
