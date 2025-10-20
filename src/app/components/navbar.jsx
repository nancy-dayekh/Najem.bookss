"use client";
import { useState, useEffect } from "react";
import { FaBars, FaTimes, FaSearch, FaShoppingCart, FaPhone, FaEnvelope } from "react-icons/fa";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logo, setLogo] = useState("");
  const [colors, setColors] = useState(null);
  const pathname = usePathname();
  const navItems = ["Home", "Products", "About", "Contact"];

  // Fetch logo and colors from Supabase
  useEffect(() => {
    async function fetchLogo() {
      const { data, error } = await supabase
        .from("logos")
        .select("logo_url")
        .order("id", { ascending: false })
        .limit(1)
        .single();
      if (data?.logo_url) setLogo(data.logo_url);
      if (error) console.error("Error fetching logo:", error.message);
    }

    async function fetchColors() {
      const { data, error } = await supabase
        .from("colors")
        .select("*")
        .order("id", { ascending: false })
        .limit(1)
        .single();
      if (data) setColors(data);
      if (error) console.error("Error fetching colors:", error.message);
    }

    fetchLogo();
    fetchColors();
  }, []);

  const mainColor = colors || {
    button_hex: "#ffffff",
    button_hover_color: "#f0f0f0",
    text_color: "#000000",
  };

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  // Fixed logo size
  const logoWidth = 140;
  const logoHeight = 70;

  return (
    <>
      <header
        className="fixed top-0 w-full z-50 shadow-md h-20"
        style={{ backgroundColor: mainColor.button_hex }}
      >
        <div className="max-w-7xl mx-auto h-full flex justify-between items-center px-5">
          {/* MOBILE VIEW */}
          <div className="flex items-center md:hidden w-full">
            <button
              onClick={toggleMobileMenu}
              className="text-black text-2xl p-0 m-0"
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>

            {logo && (
              <div className="ml-2 w-[110px] h-[40px] relative">
                <Image
                  src={logo}
                  alt="Logo"
                  fill
                  style={{ objectFit: "contain" }}
                  priority
                />
              </div>
            )}

            <div className="flex items-center gap-2 text-black ml-auto">
              <Link href="/search">
                <FaSearch className="text-[20px]" />
              </Link>
              <Link href="/addtocarts">
                <FaShoppingCart className="text-[20px]" />
              </Link>
            </div>
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:flex justify-between items-center w-full">
            {/* Logo */}
            <Link href="/home" className="flex items-center">
              {logo && (
                <div
                  className="relative"
                  style={{ width: logoWidth, height: logoHeight }}
                >
                  <Image
                    src={logo}
                    alt="Logo"
                    fill
                    style={{ objectFit: "contain" }}
                    priority
                  />
                </div>
              )}
            </Link>

            {/* Nav */}
            <nav className="flex items-center gap-14 uppercase font-semibold text-[15px] tracking-wide">
              {navItems.map((item) => {
                const route = `/${item.toLowerCase()}`;
                const isActive = pathname === route;
                return (
                  <Link key={item} href={route} className="relative group">
                    <span
                      className="text-base hover:opacity-90"
                      style={{ color: mainColor.text_color }}
                    >
                      {item}
                    </span>
                    <span
                      className="absolute left-0 bottom-[-4px] w-full h-[2px] transition-all"
                      style={{
                        backgroundColor: isActive
                          ? mainColor.text_color
                          : "transparent",
                      }}
                    ></span>
                  </Link>
                );
              })}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-4">
              <Link href="/search">
                <FaSearch className="text-lg" style={{ color: mainColor.text_color }} />
              </Link>
              <Link href="/addtocarts">
                <FaShoppingCart className="text-lg" style={{ color: mainColor.text_color }} />
              </Link>
            </div>
          </div>
        </div>

        {/* MOBILE DRAWER */}
        {mobileOpen && (
          <div className="md:hidden fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-xl p-6 flex flex-col transition-transform duration-300 ease-in-out">
            <div className="flex items-center justify-between mb-4">
              <h1
                className="text-[17px] font-bold"
                style={{ color: mainColor.text_color }}
              >
                Menu
              </h1>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-2xl"
                style={{ color: mainColor.text_color }}
              >
                <FaTimes />
              </button>
            </div>

            <hr className="border-gray-200 mb-4" />

            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="flex items-center gap-3 px-4 py-2 text-[17px] font-semibold rounded-lg transition-all"
                    style={{ color: mainColor.text_color }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        mainColor.button_hover_color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="border-gray-200 my-4" />

            <div className="text-sm space-y-3">
              <p
                className="font-semibold text-[15px]"
                style={{ color: mainColor.text_color }}
              >
                Need help?
              </p>
              <div
                className="flex items-center gap-2 cursor-pointer"
                style={{ color: mainColor.text_color }}
              >
                <FaPhone size={14} />
                <span>+961 71 407 764</span>
              </div>
              <div
                className="flex items-center gap-2 cursor-pointer"
                style={{ color: mainColor.text_color }}
              >
                <FaEnvelope size={14} />
                <span>poupee.dresses1@gmail.com</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="mt-24" />
    </>
  );
}
