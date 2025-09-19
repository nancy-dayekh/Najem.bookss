"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";

const fallbackImage = "/default-product.png";

export default function NewCollection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0); // index of first product in view
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch products
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("add_products")
          .select("*")
          .eq("is_new_collection", true);

        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch new collection:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const columns = isMobile ? 2 : 3;
  const rows = 2;
  const visibleCount = columns * rows;
  const totalProducts = products.length;

  // Prepare visible products
  const displayedProducts = [];
  for (let i = 0; i < visibleCount; i++) {
    displayedProducts.push(products[(startIndex + i) % totalProducts]);
  }

  // Arrow handlers: shift images
  const handleNext = () => setStartIndex((prev) => (prev + 1) % totalProducts);
  const handlePrevious = () =>
    setStartIndex((prev) => (prev - 1 + totalProducts) % totalProducts);

  const handleProductClick = (id) => router.push(`/products/${id}`);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-pink-500 border-solid"></div>
      </div>
    );
  }

  if (totalProducts === 0) {
    return (
      <p className="text-center py-20 text-gray-500">No products found.</p>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-5 py-10 mt-[30px] mb-[80px]">
      {/* Title */}
      <div className="flex items-center justify-center mb-12 md:mb-20">
        <hr className="flex-1 border-t-2 border-gray-300 opacity-70" />
        <h1 className="mx-6 text-lg sm:text-xl md:text-2xl font-semibold tracking-widest uppercase text-black">
          New Collection
        </h1>
        <hr className="flex-1 border-t-2 border-gray-300 opacity-70" />
      </div>

      {/* Grid + Arrows */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          aria-label="Previous"
          className="absolute top-1/2 left-0 -translate-y-1/2 w-10 h-10 bg-white shadow rounded-full hover:bg-pink-50 flex items-center justify-center z-20"
        >
          <FiChevronLeft size={24} className="text-pink-600" />
        </button>

        {/* Product Grid */}
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${rows}, 1fr)`,
          }}
        >
          {displayedProducts.map(
            (product, idx) =>
              product && (
                <div
                  key={idx}
                  className="group relative cursor-pointer overflow-hidden rounded-md shadow-md"
                  onClick={() => handleProductClick(product.id)}
                >
                  <div className="relative w-full h-[200px] sm:h-[250px] md:h-[300px] overflow-hidden rounded-lg">
                    <Image
                      src={
                        product.image?.startsWith("http")
                          ? product.image
                          : `https://jewkhodpkyqdwknnrxld.supabase.co/storage/v1/object/public/products-images/${product.image}`
                      }
                      alt={product.name || "product image"}
                      fill
                      className="object-cover transition-transform duration-300 transform group-hover:scale-105"
                      unoptimized
                    />
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-base">
                      {product.name}
                    </h3>
                    <p className="text-white font-light mt-0.5">
                      ${product.price}
                    </p>
                  </div>
                </div>
              )
          )}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          aria-label="Next"
          className="absolute top-1/2 right-0 -translate-y-1/2 w-10 h-10 bg-white shadow rounded-full hover:bg-pink-50 flex items-center justify-center z-20"
        >
          <FiChevronRight size={24} className="text-pink-600" />
        </button>
      </div>
    </section>
  );
}
