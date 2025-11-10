import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Pagination from "../components/Pagination"; 

const Orders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [meta, setMeta] = useState<any>(null); 
  const [currentPage, setCurrentPage] = useState(1); 
  const navigate = useNavigate();

  const fetchOrders = async (page: number = 1) => {
    try {
      const res = await axiosClient.get(`/orders?page=${page}`);
      setOrders(res.data.data || []);
      setMeta(res.data.meta || null);
    } catch {
      Swal.fire("Error", "Failed to fetch order history", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (id: number) => {
    try {
      const res = await axiosClient.get(`/orders/${id}`);
      setSelectedOrder(res.data.data);
    } catch {
      Swal.fire("Error", "Failed to load order details", "error");
    }
  };

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  return (
    <main className="min-h-screen bg-[#0f0f10] text-white p-10 relative">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-4">
        <h1 className="text-4xl font-bold text-purple-400">My Orders</h1>

        <div className="flex items-center gap-4 self-end md:self-auto">
          {meta && <Pagination meta={meta} onPageChange={handlePageChange} />}
          <button
            onClick={() => navigate("/")}
            className="px-4 py-[7px] my-1 bg-gray-800 text-gray-200 rounded-md hover:bg-gray-700 transition-all"
          >
            Back
          </button>
        </div>
      </div>

      {orders.length === 0 ? (
        <p className="text-gray-400">You have no orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className="p-6 bg-gray-900 rounded-xl hover:bg-gray-800 transition cursor-pointer"
              onClick={() => fetchOrderDetails(order.id)}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-purple-400 font-semibold">
                    Order #{order.id}
                  </p>
                  <p className="text-sm text-gray-400">
                    Placed on: {new Date(order.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-purple-400">
                    ₹{order.total}
                  </p>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      order.status === "Completed"
                        ? "bg-green-800 text-green-300"
                        : order.status === "Pending"
                        ? "bg-yellow-800 text-yellow-300"
                        : "bg-gray-700 text-gray-300"
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Order Details */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1d] p-8 rounded-2xl shadow-xl w-full max-w-lg relative animate-fadeIn">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              <X size={22} />
            </button>

            <h2 className="text-2xl font-semibold text-purple-400 mb-4">
              Order Details #{selectedOrder.id}
            </h2>

            <p className="text-sm text-gray-400 mb-4">
              Placed on: {new Date(selectedOrder.created_at).toLocaleString()}
            </p>

            <div className="space-y-3 border-t border-gray-700 pt-4 max-h-60 overflow-y-auto">
              {selectedOrder.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b border-gray-700 pb-2 text-gray-300"
                >
                  <div>
                    <p className="font-semibold">{item.product_name}</p>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <span>
                    ₹{item.price} × {item.quantity}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-between font-semibold mt-6 text-white text-lg">
              <span>Total:</span>
              <span>₹{selectedOrder.total}</span>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Orders;
