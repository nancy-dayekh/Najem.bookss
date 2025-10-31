"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { Search } from "lucide-react";

const HeroHeader = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [slides, setSlides] = useState([]);
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    async function fetchSlides() {
      try {
        const { data, error } = await supabase
          .from("home_slider")
          .select("*")
          .order("id", { ascending: true });
        if (error) throw error;
        setSlides(data || []);
      } catch (err) {
        console.error("Failed to fetch slides:", err);
      }
    }
    fetchSlides();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides]);

  const handleSearch = () => {
    if (searchValue.trim() !== "") {
      router.push(`/search?query=${encodeURIComponent(searchValue)}`);
    } else {
      router.push("/search");
    }
  };

  const handleShopNow = () => {
    router.push("/books");
  };

  return (
    <section className="w-full flex flex-col-reverse lg:grid lg:grid-cols-2 min-h-[90vh] overflow-hidden bg-gradient-to-br ">
      {/* LEFT SIDE */}
      <div className="flex flex-col justify-center items-center lg:items-start text-center lg:text-left px-6 sm:px-10 md:px-16 py-12 space-y-6">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight">
          Najem <span className="text-[#0060bf] drop-shadow-md">Books</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-gray-700 font-medium max-w-md leading-relaxed">
          Discover your next favorite story and explore a world of knowledge,
          passion, and imagination.
        </p>

        {/* SEARCH BOX */}
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-3 shadow-lg border border-white/50">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for books..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-3 py-2 text-gray-700 placeholder-gray-500 bg-transparent border-none focus:outline-none"
            />
          </div>
          <button
            onClick={handleSearch}
            className="w-full sm:w-auto bg-[#0060bf] hover:bg-[#004c94] text-white px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-md hover:scale-105"
          >
            Search
          </button>
        </div>

        {/* CTA BUTTON */}
        <button
          onClick={handleShopNow}
          className="bg-gradient-to-r from-[#0060bf] to-[#004c94] text-white px-10 py-3 rounded-2xl text-sm sm:text-base font-semibold shadow-lg hover:scale-105 transition-transform duration-300 hover:shadow-xl"
        >
          Shop Now
        </button>
      </div>

      {/* RIGHT SIDE (IMAGE SLIDER) */}
      <div className="relative w-full h-[320px] sm:h-[420px] md:h-[500px] lg:h-full flex items-center justify-center">
        {slides.length > 0 && slides[currentIndex] ? (
          <img
            src={slides[currentIndex].media_url}
            alt={slides[currentIndex].title || `Slide ${currentIndex + 1}`}
            className="w-full h-full object-cover rounded-t-3xl lg:rounded-none transition-all duration-700 shadow-md"
          />
        ) : (
          <p className="text-gray-500 text-lg">Loading slides...</p>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#E6EEFF]/60 to-transparent rounded-t-3xl lg:rounded-none"></div>
      </div>
    </section>
  );
};

export default HeroHeader;
