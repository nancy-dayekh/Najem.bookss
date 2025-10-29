"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import NewCollection from "../newcollection/page";
import Products from "../books/book/product";
import HomeshopNow from "../homeshopnow/page";
import HomeSlider from "./homeslider.jsx";
export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- Scroll Animation ----------------
  const handleScrollAnimation = () => {
    const elements = document.querySelectorAll(".animate-scroll");
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight * 0.85) {
        el.classList.add("opacity-100", "translate-y-0");
        el.classList.remove("opacity-0", "translate-y-5");
      } else {
        el.classList.remove("opacity-100", "translate-y-0");
        el.classList.add("opacity-0", "translate-y-5");
      }
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation();
    return () => window.removeEventListener("scroll", handleScrollAnimation);
  }, []);

  // ---------------- Fetch Products ----------------
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("books")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error("Failed to fetch products from Supabase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleViewMore = () => router.push("/books");

  return (
    <div className="w-full mt-10">
      {/* ---------------- New Collection Section ---------------- */}
      
      <HomeSlider/>
      
      <NewCollection />

      {/* ---------------- Home Shop Now Section ---------------- */}
      <HomeshopNow />

      {/* ---------------- Products Header ---------------- */}
      <div className="w-full flex flex-col items-center justify-center px-4 mb-0">
        <div className="flex items-center justify-center mb-0 md:mb-0 w-full max-w-6xl mx-auto px-4">
          <hr className="flex-1 border-t-2 border-gray-300 opacity-70" />
          <h1 className="mx-6 text-lg sm:text-xl md:text-2xl font-semibold tracking-widest uppercase text-black">
            All Books
          </h1>
          <hr className="flex-1 border-t-2 border-gray-300 opacity-70" />
        </div>
        <div className="mt-2 mr-6">
          <span
            onClick={handleViewMore}
            className="cursor-pointer text-sm sm:text-base text-blue-500 font-medium uppercase tracking-wide hover:underline"
          >
            View More
          </span>
        </div>
      </div>

      {/* ---------------- Products Section ---------------- */}
      <div className="flex justify-center w-full">
        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="w-full max-w-6xl px-4">
            <Products products={products} />
          </div>
        )}
      </div>
    </div>
  );
}
