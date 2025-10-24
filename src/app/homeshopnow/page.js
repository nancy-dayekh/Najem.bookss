"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function HomepageBanner() {
  const router = useRouter();
  const [banner, setBanner] = useState(null);
  const [colors, setColors] = useState(null);

  useEffect(() => {
    fetchBanner();
    fetchColors();
  }, []);

  async function fetchBanner() {
    const { data, error } = await supabase
      .from("homepage_banner")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (error) console.error("Error fetching banner:", error);
    else setBanner(data);
  }

  async function fetchColors() {
    const { data, error } = await supabase
      .from("colors")
      .select("*")
      .order("id")
      .limit(1)
      .single(); // get the first color set

    if (error) console.error("Error fetching colors:", error);
    else setColors(data);
  }

  const handleBackToShop = () => {
    router.push("/books");
  };

  if (!banner || !colors) return <div>Loading...</div>;

  return (
    <div className="flex w-full justify-center items-center">
      <div className="flex flex-col sm:flex-row items-center justify-center  px-4 sm:px-12 py-10 gap-8 sm:gap-6 w-full">
        {/* Left Section: Text + Button */}
        <div className="w-full sm:w-1/2 text-center sm:text-left lg:ml-20">
          <h2
            className="text-lg sm:text-2xl font-bold leading-snug mb-3"
            style={{ color: colors.text_color }}
          >
            {banner.title}
          </h2>
          <p
            className="text-sm sm:text-base mb-6 leading-relaxed max-w-md mx-auto sm:mx-0"
            style={{ color: colors.text_color }}
          >
            {banner.description}
          </p>
          <button
            onClick={handleBackToShop}
            className="px-6 py-3 rounded-md text-sm font-bold transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${colors.button_hex} 0%, ${colors.button_hover_color} 100%)`,
              color: colors.button_text_color || colors.text_color,
              border: `2px solid ${colors.button_hex}`,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = `linear-gradient(135deg, ${colors.button_hover_color} 0%, ${colors.button_hex} 100%)`)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = `linear-gradient(135deg, ${colors.button_hex} 0%, ${colors.button_hover_color} 100%)`)
            }
          >
            {/* Hover shine overlay */}
            <span
              className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-25 transition-all duration-300 rounded-md"
              style={{ mixBlendMode: "overlay" }}
            ></span>

            <span className="relative">Shop Now</span>
          </button>
        </div>

        {/* Right Section: Image */}
        <div className="w-full sm:w-1/2 flex justify-center">
          <div className="w-60 sm:w-72 md:w-80 lg:w-96 rounded-md overflow-hidden">
            <Image
              src={banner.image_url}
              alt={banner.title}
              width={400}
              height={250}
              className="object-cover rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
