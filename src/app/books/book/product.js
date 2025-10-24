"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Products({ products, loading }) {
  const router = useRouter();
  const displayedProducts = Array.isArray(products) ? products : [];

  const handleLearnMore = (productId) => {
    router.push(`/books/${productId}`);
  };

  return (
    <div className="mt-6 px-4 sm:px-6 w-full font-sans">
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="w-12 h-12 border-4 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : displayedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.map((product) => (
            <div
              key={product.id}
              className="cursor-pointer group overflow-hidden relative"
              onClick={() => handleLearnMore(product.id)}
            >
              {/* Image */}
              <div className="w-full aspect-[1/1] bg-gray-100 overflow-hidden flex items-center justify-center rounded-lg shadow-sm">
                <Image
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `https://jewkhodpkyqdwknnrxld.supabase.co/storage/v1/object/public/products-images/${product.image}`
                  }
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Product info */}
              <div className="mt-3 text-left px-1">
                <h3
                  className="text-[15px] sm:text-[16px] md:text-[17px] font-medium text-gray-800 group-hover:text-gray-900 transition-colors truncate"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <p className="mt-1 text-[15px] sm:text-[16px] md:text-[17px] font-semibold text-gray-900 tracking-wide">
                  ${product.price}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 text-sm mt-10">
          No products available.
        </div>
      )}
    </div>
  );
}
