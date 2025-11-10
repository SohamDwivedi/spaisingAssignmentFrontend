import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Swal from "sweetalert2";
import AuthModal from "../components/AuthModal";
import axiosClient from "../api/axiosClient";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [images, setImages] = useState<string[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/public/products/${id}`);
        const data = res.data.data;
        setProduct(data);
        setImages(JSON.parse(data.images));
      } catch (err) {
        setError("Failed to load product details.");
      } finally {
        setLoading(false);
      }
    };

    setIsLoggedIn(!!token);
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    if (!isLoggedIn) {
      // Save intent for later if user isn't logged in
      localStorage.setItem(
        "pendingAddToCart",
        JSON.stringify({ productId: product.id, quantity })
      );
      setShowAuthModal(true);
      return;
    }

    try {
      await axiosClient.post("/cart", {
        product_id: product.id,
        quantity,
      });

      Swal.fire({
        icon: "success",
        title: "Added to cart",
        text: `${product.name} added successfully!`,
        timer: 1200,
        showConfirmButton: false,
      });

      if ((window as any).updateCartCount) {
        (window as any).updateCartCount();
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to add to cart",
        text: "Something went wrong.",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 mt-10 text-lg">{error}</p>;

  if (!product) return null;

  return (
    <div className="min-h-screen bg-[#0f0f10] text-white py-10 px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
        {/* Image Section */}
        <div className="flex flex-col items-center">
          <button
            onClick={() => navigate("/")}
            className="mb-6 self-start px-4 py-2 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 transition-all"
          >
            Back
          </button>

          <div className="relative w-full h-[450px] bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 p-2 rounded-full transition"
            >
              <ChevronLeft size={24} />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={currentImage}
                src={images[currentImage]}
                alt={product.name}
                className="w-full h-full object-contain"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
              />
            </AnimatePresence>

            <button
              onClick={() =>
                setCurrentImage((prev) =>
                  prev === images.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/80 p-2 rounded-full transition"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="flex mt-4 gap-3 flex-wrap justify-center">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`thumb-${index}`}
                className={`h-20 w-20 object-cover rounded-md cursor-pointer transition-transform ${
                  currentImage === index
                    ? "ring-2 ring-purple-500 scale-105"
                    : "hover:scale-105"
                }`}
                onMouseEnter={() => setCurrentImage(index)}
                onMouseLeave={() => setCurrentImage(index)}
              />
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-center">
          <h2 className="text-3xl font-semibold mb-3">{product.name}</h2>
          <p className="text-gray-300 mb-4">{product.description}</p>
          <p className="text-purple-400 text-2xl font-bold mb-6">
            ₹{product.price}
          </p>

          <div className="flex items-center gap-4 mb-6">
            <span className="text-gray-400">Quantity:</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => {
                  if (product.stock > quantity) setQuantity((q) => q + 1);
                }}
                className="px-3 py-1 bg-gray-800 rounded hover:bg-gray-700"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Add to Cart
          </button>

          {showAuthModal && (
            <AuthModal
              onClose={() => setShowAuthModal(false)}
              onSuccess={() => {
                setShowAuthModal(false);
                setIsLoggedIn(true);
                handleAddToCart(); //retry after login
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
