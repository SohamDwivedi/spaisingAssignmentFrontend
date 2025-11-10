import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Order";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import EditProduct from "./pages/admin/EditProduct";
import { useEffect, useState } from "react";
import AuthModal from "./components/AuthModal";
import CreateProduct from "./pages/admin/CreateProduct";


function App() {

  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    const handleOpenAuth = () => setShowAuthModal(true);
    window.addEventListener("open-auth-modal", handleOpenAuth);
    return () => {
      window.removeEventListener("open-auth-modal", handleOpenAuth);
    };
  }, []);
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route
          path="/"
          element={
            <ProtectedRoute restrictRoles={["admin"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/product/:id"
          element={
            <ProtectedRoute restrictRoles={["admin"]}>
              <ProductDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute restrictRoles={["admin"]}>
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* Protected (User) */}
        <Route
          path="/orders"
          element={
            <ProtectedRoute allowedRoles={["user"]}>
              <Orders />
            </ProtectedRoute>
          }
        />

        {/* Protected (Admin) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/edit/:id/:page"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products/create"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
      </Routes>
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}
    </Router>
  );
}

export default App;
