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
              <div className="w-full aspect-[1/1] bg-white overflow-hidden flex items-center justify-center border border-gray-100">
                <Image
                  src={
                    product.image.startsWith("http")
                      ? product.image
                      : `https://jewkhodpkyqdwknnrxld.supabase.co/storage/v1/object/public/products-images/${product.image}`
                  }
                  alt={product.name}
                  width={400}
                  height={400}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Product info */}
              <div className="mt-2 text-left px-1">
                <h3
                  className="text-sm sm:text-[15px] md:text-[16px] font-normal text-gray-700 truncate"
                  title={product.name}
                >
                  {product.name}
                </h3>
                <p className="mt-1 text-sm sm:text-[15px] md:text-[16px] font-semibold text-gray-900">
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
