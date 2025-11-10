import React, { useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { useNavigate } from "react-router-dom";
import { Edit3, Trash2 } from "lucide-react";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import axiosClient from "../../api/axiosClient";


const AdminDashboard = () => {
    const [stats, setStats] = useState<any>(null);
    const [activeTab, setActiveTab] = useState("overview");
    const [activePage, setActivePage] = useState(1);
    const [data, setData] = useState<any[]>([]);
    const [meta, setMeta] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.state?.activeTab) {
            setActiveTab(location.state.activeTab);
        }
        if(location.state?.activePage){
            setActivePage(location.state.activePage);
        }
    }, [location.state]);

    const fetchStats = async () => {
        try {
            const res = await axiosClient.get("/admin/dashboard");
            setStats(res.data);
        } catch (err:any) {
            if(err?.response?.data?.message==="Unauthorized or invalid token"){
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                navigate('/');
            }
            console.error("Failed to fetch dashboard stats:", typeof err,err.response.data.message,err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTabData = async (tab: string, page: number = 1) => {
        setLoading(true);
        let endpoint = "";
        switch (tab) {
        case "products":
            endpoint = `/admin/products?page=${page}`;
            break;
        case "orders":
            endpoint = `/admin/orders?page=${page}`;
            break;
        case "users":
            endpoint = `/admin/users?page=${page}`;
            break;
        default:
            setData([]);
            setMeta(null);
            setLoading(false);
            return;
        }

        try {
        const res = await axiosClient.get(endpoint);
        setData(res.data.data || []);
        setMeta(res.data.meta || null);
        } catch (err) {
        console.error(`Failed to fetch ${tab} data:`, err);
        } finally {
        setLoading(false);
        }
    };

    useEffect(() => {
        const pending = localStorage.getItem('pendingAddToCart');
        if (pending !== null) {
            localStorage.removeItem('pendingAddToCart');
        }
        fetchStats();
    }, []);

    useEffect(() => {
        if (activeTab !== "overview") fetchTabData(activeTab, activePage);
    }, [activeTab]);

    const handlePageChange = (page: number) => {
        setActivePage(page);
        fetchTabData(activeTab, page);
    };
    const handleDelete = async (id: number) => {
    // Confirm first
        Swal.fire({
            title: "Are you sure?",
            text: "This action will permanently delete the product!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#9333ea", // purple
            cancelButtonColor: "#6b7280", // gray
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
            background: "#1f1f1f",
            color: "#fff",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await axiosClient.delete(`/admin/products/${id}`);
                    Swal.fire({
                        icon: "success",
                        title: "Deleted!",
                        text: "Product has been deleted successfully.",
                        showConfirmButton: false,
                        timer: 1500,
                        background: "#1f1f1f",
                        color: "#fff",
                    });
                    fetchTabData("products"); // refresh list after delete
                    fetchStats();
                } catch (err) {
                    console.error("Delete failed:", err);
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: "Failed to delete the product.",
                        background: "#1f1f1f",
                        color: "#fff",
                    });
                }
            }
        });
    };


    if (loading)
        return (
        <div className="flex justify-center items-center h-[80vh]">
            <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <main className="min-h-screen bg-[#0f0f10] text-white p-10">

        <div className="flex gap-6 mb-8">
            {["overview", "products", "orders", "users"].map((tab) => (
            <button
                key={tab}
                onClick={() => {
                    setActivePage(1);
                    setActiveTab(tab);
                }}
                className={`px-4 py-2 rounded-md ${
                activeTab === tab
                    ? "bg-purple-600 text-white"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
            >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
            ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-900 p-6 rounded-xl text-center">
                <h2 className="text-xl font-semibold mb-2">Users</h2>
                <p className="text-3xl text-purple-400">{stats.total_users}</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl text-center">
                <h2 className="text-xl font-semibold mb-2">Products</h2>
                <p className="text-3xl text-purple-400">{stats.total_products}</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-xl text-center">
                <h2 className="text-xl font-semibold mb-2">Revenue</h2>
                <p className="text-3xl text-purple-400">₹{stats.total_revenue}</p>
            </div>
            </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
            <div className="bg-gray-900 p-6 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold mb-4 text-purple-400">
                        Products
                    </h2>
                    <button
                        onClick={() => navigate("/admin/products/create")}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-semibold"
                    >
                        Add Product
                    </button>
                </div>
            {data.length === 0 ? (
                <p className="text-gray-400">No products found.</p>
            ) : (
                <>
                    <table className="w-full text-left border-collapse">
                        <thead>
                        <tr className="text-purple-400 border-b border-gray-700">
                            <th className="p-3">ID</th>
                            <th className="p-3">Name</th>
                            <th className="p-3">Price</th>
                            <th className="p-3">Stock</th>
                            <th className="p-3 text-center">Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                            {data.map((p: any) => (
                                <tr key={p.id} className="border-b border-gray-800">
                                    <td className="p-3">{p.id}</td>
                                    <td className="p-3">{p.name}</td>
                                    <td className="p-3">₹{p.price}</td>
                                    <td className="p-3">{p.stock}</td>
                                    <td className="p-3 text-center space-x-3">

                                        <button
                                        onClick={() => navigate(`/admin/products/edit/${p.id}/${activePage}`)}
                                        className="text-blue-400 hover:text-blue-500"
                                        title="Edit">
                                            <Edit3 size={18} />
                                        </button>


                                        <button
                                        onClick={() => handleDelete(p.id)}
                                        className="text-red-400 hover:text-red-500 transition"
                                        title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <Pagination meta={meta} onPageChange={handlePageChange} />
                </>
            )}
            </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
        <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Orders</h2>
            {data.length === 0 ? (
            <p className="text-gray-400">No orders found.</p>
            ) : (
            <>
                <ul className="space-y-3">
                {data.map((o: any) => (
                    <li key={o.id} className="p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between">
                        <span>Order #{o.id}</span>
                        <span>
                        Status:{" "}
                        <span
                            className={`text-xs px-2 py-1 rounded-full ${
                            o.status === "Completed"
                                ? "bg-green-800 text-green-300"
                                : o.status === "Pending"
                                ? "bg-yellow-800 text-yellow-300"
                                : "bg-gray-700 text-gray-300"
                            }`}
                        >
                            {o.status}
                        </span>
                        </span>
                    </div>
                    <p className="text-sm text-gray-400">
                        Total: ₹{o.total} | Placed on{" "}
                        {new Date(o.created_at).toLocaleString()}
                    </p>
                    </li>
                ))}
                </ul>
                <Pagination meta={meta} onPageChange={handlePageChange} />
            </>
            )}
        </div>
        )}


        {/* Users */}
        {activeTab === "users" && (
            <div className="bg-gray-900 p-6 rounded-xl">
            <h2 className="text-2xl font-semibold mb-4 text-purple-400">Users</h2>
            {data.length === 0 ? (
                <p className="text-gray-400">No users found.</p>
            ) : (
                <>
                <ul className="space-y-3">
                    {data.map((u: any) => (
                    <li key={u.id} className="p-4 bg-gray-800 rounded-lg">
                        <div className="flex justify-between">
                        <span>{u.name}</span>
                        <span className="text-gray-400">{u.email}</span>
                        </div>
                    </li>
                    ))}
                </ul>
                <Pagination meta={meta} onPageChange={handlePageChange} />
                </>
            )}
            </div>
        )}
        </main>
    );
};

export default AdminDashboard;
