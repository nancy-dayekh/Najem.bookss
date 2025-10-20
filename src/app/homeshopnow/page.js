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
    router.push("/products");
  };

  if (!banner || !colors) return <div>Loading...</div>;

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between px-4 sm:px-12 py-10 gap-8 sm:gap-6 w-full">
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
          className="px-6 py-2 rounded-md text-sm font-semibold transition duration-300"
          style={{
            backgroundColor: colors.button_hex,
            color: colors.text_color,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = colors.button_hover_color)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = colors.button_hex)
          }
        >
          Shop Now
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
  );
}
