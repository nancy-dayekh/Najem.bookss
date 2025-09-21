"use client";

import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { supabase } from "../../../lib/supabaseClient";
import NewCollection from "../newcollection/page";
import Products from "../products/product/product";
import HomeshopNow from "../homeshopnow/page";

export default function Home() {
  const router = useRouter();
  const handleViewMore = () => router.push("/products");

  const slides = [
    { type: "video", src: "/video/sliderhomevideo3.mp4" },
    { type: "images", src: "/images/sliderhome1.jpg" },
    { type: "images", src: "/images/homeslider2.jpg" },
  ];

  // ✅ FIX: add missing state and ref
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  // Scroll animation using Tailwind utility classes
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

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up scroll event listener for animations
    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation(); // Trigger once on mount

    return () => window.removeEventListener("scroll", handleScrollAnimation);
  }, []);

  useEffect(() => {
    if (!sessionStorage.getItem("hasRefreshed")) {
      sessionStorage.setItem("hasRefreshed", "true");
      window.location.reload();
    }
  }, []);

  // ✅ FIX: use currentIndex properly for autoplay
  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [currentIndex]);

  const prevSlide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from("add_products")
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

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: true,
  };

  return (
    <div className="w-full">
      {/* Slider */}
      <div className="relative w-full mt-[20px] sm:mt-[40px] h-[300px] sm:h-[400px] overflow-hidden group">
        <div className="mt-5 md:mt-3">
          <div
            className="flex gap-[20px] transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {slides.map((slide, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-full h-[300px] sm:h-[400px] rounded-[10px] overflow-hidden"
              >
                {slide.type === "video" ? (
                  <video
                    src={slide.src}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={slide.src}
                    alt={`Slide ${idx}`}
                    width={1920}
                    height={1080}
                    className="object-cover w-full h-full"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Arrows */}
        {/* Arrows */}
        <button
          onClick={prevSlide}
          aria-label="Previous slide"
          className="absolute top-1/2 left-4 -translate-y-1/2 
             w-10 h-10 sm:w-12 sm:h-12 
             bg-black/40 hover:bg-black/60 
             rounded-full shadow-lg 
             flex items-center justify-center 
             transition-all duration-300 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="white"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          aria-label="Next slide"
          className="absolute top-1/2 right-4 -translate-y-1/2 
             w-10 h-10 sm:w-12 sm:h-12 
             bg-black/40 hover:bg-black/60 
             rounded-full shadow-lg 
             flex items-center justify-center 
             transition-all duration-300 z-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2.5}
            stroke="white"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === idx
                  ? "bg-black scale-125 shadow-lg"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Other Components */}
      <NewCollection />
      <HomeshopNow />

      {/* Header + View More */}
      <div className="w-full flex flex-col items-center justify-center px-4 mb-10">
        <div className="flex items-center w-full max-w-6xl gap-4 sm:gap-8">
          <hr className="flex-1 border-t border-[#dcdcdc]" />
          <h1 className="mx-6 text-lg sm:text-xl md:text-2xl font-semibold tracking-widest uppercase text-black">
            All Dresses
          </h1>
          <hr className="flex-1 border-t border-[#dcdcdc]" />
        </div>
        <div className="mt-2 mr-6">
          <span
            onClick={handleViewMore}
            className="cursor-pointer text-pink-400 text-sm sm:text-base font-medium uppercase tracking-wide hover:underline"
          >
            View More
          </span>
        </div>
      </div>

      {/* Products Section */}
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
