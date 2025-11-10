import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import Swal from "sweetalert2";
import { Plus, Trash2 } from "lucide-react";
import AuthModal from "../../components/AuthModal";

const EditProduct = () => {
  const { id, page } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [] as string[],
  });
  const [newImage, setNewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [highlightInput, setHighlightInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosClient.get(`/admin/products?page=${page}`);
        const allProducts = [...res.data.data];
        const product = allProducts.find(
          (item: any) => item.id === parseInt(id!)
        );

        if (product) {
          setForm({
            name: product.name || "",
            description: product.description || "",
            price: product.price || "",
            stock: product.stock || "",
            images: Array.isArray(product.images)
              ? product.images
              : JSON.parse(product.images || "[]"),
          });
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, page]);

  const handleAddImage = () => {
    if (!newImage.trim()) {
      // highlight + focus when empty
      setHighlightInput(true);
      inputRef.current?.focus();
      setTimeout(() => setHighlightInput(false), 1500);
      return;
    }
    setForm((prev) => ({
      ...prev,
      images: [...prev.images, newImage.trim()],
    }));
    setNewImage("");
  };

  const handleRemoveImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.images.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "At least one image is required",
        text: "Please add at least one image link.",
        background: "#1f1f1f",
        color: "#fff",
      });
      return;
    }

    try {
      const payload = {
        ...form,
        images: JSON.stringify(form.images),
      };

      const res = await axiosClient.put(`/admin/products/${id}`, payload);
      if (res) {
        Swal.fire({
          icon: "success",
          title: "Product updated successfully!",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (err: any) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error updating product",
        text: err.response?.data?.message || "Something went wrong.",
      });
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0f0f10] text-white p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-purple-400">Edit Product</h1>
        <button
          onClick={() =>
            navigate("/admin", {
              state: { activeTab: "products", activePage: page },
            })
          }
          className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-4 py-2 rounded-md"
        >
          Back
        </button>
      </div>

      {/* Layout */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-900 p-8 rounded-lg shadow-lg"
      >
        {/* LEFT: Product Details */}
        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:border-purple-500 outline-none resize-none"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Price</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
              min="0"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:border-purple-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Stock</label>
            <input
              type="number"
              value={form.stock}
              onChange={(e) => setForm({ ...form, stock: e.target.value })}
              required
              min="0"
              className="w-full bg-gray-800 text-white px-4 py-2 rounded-md border border-gray-700 focus:border-purple-500 outline-none"
            />
          </div>
        </div>

        {/* RIGHT: Product Images + Update Button */}
        <div className="flex flex-col justify-between h-full">
          <div>
            <label className="block text-gray-300 mb-3 text-lg font-semibold">
              Product Images
            </label>

            <div className="flex gap-3 mb-4">
              <input
                ref={inputRef}
                type="text"
                placeholder="Enter image URL then click +"
                value={newImage}
                onChange={(e) => setNewImage(e.target.value)}
                className={`flex-1 bg-gray-800 text-white px-4 py-2 rounded-md border ${
                  highlightInput
                    ? "border-red-500 animate-pulse"
                    : "border-gray-700"
                } focus:border-purple-500 outline-none transition-all`}
              />
              <button
                type="button"
                onClick={handleAddImage}
                className="bg-purple-600 hover:bg-purple-700 px-3 rounded-md flex items-center justify-center"
                title="Add image"
              >
                <Plus size={18} />
              </button>
            </div>

            {form.images.length > 0 ? (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
                {form.images.map((img, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-800 border border-gray-700 rounded-md px-4 py-2 hover:border-purple-500 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={img}
                        alt={`img-${index}`}
                        className="w-14 h-14 object-cover rounded-md border border-gray-700"
                      />
                      <span className="text-sm text-gray-300 truncate max-w-[240px] md:max-w-[320px]">
                        {img}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="text-red-400 hover:text-red-500 transition ml-3"
                      title="Remove"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm mt-2">
                No images added yet. Please add at least one.
              </p>
            )}
          </div>

          {/* Moved Update Button here */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-md text-lg transition-all"
            >
              Update Product
            </button>
          </div>
        </div>
      </form>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </main>
  );
};

export default EditProduct;
