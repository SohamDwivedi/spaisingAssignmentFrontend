import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import { RootState, AppDispatch } from "../app/store";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error, meta } = useSelector(
    (state: RootState) => state.products
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProducts(currentPage));
  }, [dispatch, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[80vh]">
        <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );

  if (error)
    return <p className="text-center text-red-500 mt-10 text-lg">{error}</p>;

  return (
    <main className="min-h-screen bg-[#0f0f10] p-10 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10">
        <h1 className="text-4xl font-bold text-center md:text-left mb-6 md:mb-0">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-500">
            Product Catalogue
          </span>
        </h1>

        {/* Pagination Top Right */}
        {meta && (
          <div className="flex justify-center md:justify-end">
            <Pagination meta={meta} onPageChange={handlePageChange} />
          </div>
        )}
      </div>
      {list.length === 0 ? (
        <p className="text-center text-gray-400">No products found.</p>
      ) : (
      <motion.div
        layout
        className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
      >
        {list.map((product, i) => {
          let images: string[] = [];
          try {
            images = JSON.parse(product.images);
          } catch {
            images = [];
          }

          return (
            <Link key={product.id} to={`/product/${product.id}`}>
              <ProductCard
                product={product}
                images={images}
                delay={i * 0.06}
              />
            </Link>
          );
        })}
      </motion.div>)}
    </main>
  );
};

// ProductCard
const ProductCard = ({
  product,
  images,
  delay,
}: {
  product: any;
  images: string[];
  delay: number;
}) => {
  const [index, setIndex] = useState(0);
  const [hovering, setHovering] = useState(false);

  // Handle image auto-carousel while hovering
  useEffect(() => {
    let interval: any;
    if (hovering && images.length > 1) {
      interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % images.length);
      }, 1400); // 1.4 second per image
    } else {
      setIndex(0);
    }
    return () => clearInterval(interval);
  }, [hovering, images]);

  const mainImage =
    images[index] ||
    "https://via.placeholder.com/400x250?text=Product+Image";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{
        scale: 1.04,
        boxShadow: "0 12px 30px rgba(99,102,241,0.25)",
      }}
      className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-lg cursor-pointer transition-transform duration-300"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* Image Container */}
      <div className="relative h-80 md:h-72 lg:h-80 w-full">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            src={mainImage}
            alt={product.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            loading="lazy"
          />
        </AnimatePresence>
        {/* Subtle overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
      </div>

      {/* Product Details */}
      <div className="p-5 absolute bottom-0 left-0 w-full bg-gradient-to-t from-gray-900/95 via-gray-900/70 to-transparent">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-sm text-gray-300 mb-2 line-clamp-2">
          {product.description}
        </p>
        <p className="text-purple-400 font-semibold text-lg">
          ₹{product.price.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
};


export default Home;
