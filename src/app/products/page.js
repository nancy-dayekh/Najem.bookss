"use client";

import { useState, useEffect } from "react";
import Products from "./product/product";
import { supabase } from "../../../lib/supabaseClient"; // تأكدي المسار صحيح

export default function DisplayProducts() {
  const [products, setProducts] = useState([]);
  const [selectedYears, setSelectedYears] = useState(0);
  const [loading, setLoading] = useState(false);

useEffect(() => {
  async function fetchProducts() {
    setLoading(true);
    try {
      let query = supabase.from("add_products").select("*").order("id", { ascending: true });

      if (selectedYears > 0) {
        query = query.eq("years", selectedYears);
      }

      const { data, error } = await query;
      console.log("Fetched products:", data, "Error:", error); // Debug
      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchProducts();
}, [selectedYears]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 mt-28">
      <h3 className="text-center mt-20 mb-8 text-3xl font-medium tracking-wide font-sans">
        All Dresses
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filter Section */}
        <div className="lg:col-span-3 mt-6 ml-4">
          <h3 className="text-[1.5rem] italic text-[#333] leading-tight truncate mb-3">
            Filter Age
          </h3>

          <div className="relative">
            <input
              type="range"
              min="0"
              max="25"
              step="1"
              value={selectedYears}
              onChange={(e) => setSelectedYears(Number(e.target.value))}
              className="w-full h-2 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="text-sm text-pink-500 mt-2">{selectedYears} years</div>
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-1 mb-6">
            <span>0</span>
            <span>25</span>
          </div>

          <button
            className="bg-transparent border border-pink-500 text-pink-500 hover:bg-pink-100 transition duration-200 px-4 py-2 text-sm rounded font-Ancizar_Serif"
            onClick={() => setSelectedYears(selectedYears)}
          >
            Apply Filter
          </button>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-9 w-full">
          <Products products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}
