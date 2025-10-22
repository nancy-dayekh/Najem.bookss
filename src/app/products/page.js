"use client";

import { useState, useEffect } from "react";
import Products from "./product/product";
import { supabase } from "../../../lib/supabaseClient";

export default function DisplayProducts() {
  const [products, setProducts] = useState([]);
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  const [loading, setLoading] = useState(false);
  const [colors, setColors] = useState({
    text_color: "#333",
    slider_bg: "#dbeafe",
    accent_color: "#3b82f6",
    price_color: "#3b82f6",
  });

  // Fetch color scheme from database
  async function fetchColors() {
    const { data, error } = await supabase
      .from("colors")
      .select("*")
      .order("id")
      .limit(1)
      .single();
    if (!error && data) {
      setColors({
        text_color: data.text_color || "#333",
        slider_bg: data.slider_bg || "#dbeafe",
        accent_color: data.hover_color || "#3b82f6",
        price_color: data.hover_color || "#3b82f6",
      });
    }
  }

  // Fetch max price dynamically
  async function fetchMaxPrice() {
    const { data, error } = await supabase
      .from("books")
      .select("price")
      .order("price", { ascending: false })
      .limit(1)
      .single();

    if (!error && data?.price) {
      setMaxPrice(data.price);
      setSelectedPrice(15);
    }
  }

  // Fetch products with optional price filter
  async function fetchProducts() {
    setLoading(true);
    try {
      let query = supabase.from("books").select("*").order("id", { ascending: true });

      if (selectedPrice > 0) {
        query = query.lte("price", selectedPrice);
      }

      const { data, error } = await query;
      if (error) throw error;

      setProducts(data || []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchColors();
    fetchMaxPrice();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [selectedPrice]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 mt-28">
      <h3
        className="text-center mt-20 mb-8 text-3xl font-medium tracking-wide font-sans"
        style={{ color: colors.text_color }}
      >
        All Books
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filter Section */}
        <div className="lg:col-span-3 mt-6 ml-4">
          <h3
            className="text-[1.5rem] italic leading-tight truncate mb-3"
            style={{ color: colors.text_color }}
          >
            Filter by Price
          </h3>

          <div className="relative">
            <input
              type="range"
              min={0}
              max={maxPrice}
              step={1}
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer"
              style={{
                backgroundColor: colors.slider_bg,
                accentColor: colors.text_color ,
              }}
            />
        
          </div>

          <div className="flex justify-between text-xs mt-1 mb-6" style={{ color: colors.text_color }}>
            <span>$0</span>
            <span>${maxPrice}</span>
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-9 w-full">
          <Products products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}
