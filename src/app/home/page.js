"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import NewCollection from "../newcollection/page";
import Products from "../books/book/product";
import HomeshopNow from "../homeshopnow/page";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- Fetch Slides ----------------
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

  // ---------------- Autoplay ----------------
  useEffect(() => {
    if (slides.length === 0) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearTimeout(timeoutRef.current);
  }, [currentIndex, slides]);

  const prevSlide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

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
      {/* ---------------- Slider ---------------- */}
      <div className="flex items-center justify-center p-4">
        <div className="max-w-6xl w-full">
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="w-full flex-shrink-0 flex justify-center items-center"
                >
                  <img
                    src={slide.media_url}
                    alt={slide.title || `Slide ${index + 1}`}
                    className="w-full h-96 md:h-[60vh] object-cover"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-3 rounded-full shadow-lg transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`transition-all duration-300 rounded-full ${
                    currentIndex === index
                      ? "bg-white w-8 h-3"
                      : "bg-white/50 w-3 h-3 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Other Components ---------------- */}
      <NewCollection />
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
            className="cursor-pointer text-sm sm:text-base  text-blue-500 font-medium uppercase tracking-wide hover:underline"
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
