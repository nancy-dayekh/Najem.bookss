"use client";

import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";

import { supabase } from "../../../lib/supabaseClient";
import NewCollection from "../newcollection/page";
import Products from "../products/product/product";
import HomeshopNow from "../homeshopnow/page";

export default function Home() {
  const router = useRouter();
  const handleViewMore = () => router.push("/products");

  const slides = [
    "/images/testing.jpeg",
    "/images/pictureabout2.jpg",
    "/images/pictureabout1.jpg",
  ];

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="w-full relative">
      {/* Small Slider */}
      <div className="w-full max-w-6xl mx-auto mb-10 rounded-lg overflow-hidden h-[250px] sm:h-[300px] relative">
        <Slider {...settings}>
          {slides.map((src, idx) => (
            <div
              key={idx}
              className="w-full h-full flex items-center justify-center"
            >
              <Image
                src={src}
                alt={`Slide ${idx + 1}`}
                width={1920}
                height={1080}
                className="w-full h-full object-contain"
                priority
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Components */}
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

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/96171407764"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 z-50 w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg animate-bounce hover:scale-110 transition-transform"
      >
        <FaWhatsapp className="text-white text-2xl" />
      </a>
    </div>
  );
}
