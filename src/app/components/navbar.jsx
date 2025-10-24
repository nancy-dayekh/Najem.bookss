"use client";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaSearch,
  FaShoppingCart,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logo, setLogo] = useState("");
  const [colors, setColors] = useState(null);
  const pathname = usePathname();
  const navItems = ["Home", "Books", "About", "Contact"];

  useEffect(() => {
    async function fetchData() {
      const [{ data: logoData }, { data: colorData }] = await Promise.all([
        supabase
          .from("logos")
          .select("logo_url")
          .order("id", { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from("colors")
          .select("*")
          .order("id", { ascending: false })
          .limit(1)
          .single(),
      ]);
      if (logoData?.logo_url) setLogo(logoData.logo_url);
      if (colorData) setColors(colorData);
    }
    fetchData();
  }, []);

  const mainColor = colors || {
    button_hex: "#ffffff",
    button_hover_color: "#f0f0f0",
    text_color: "#000000",
  };

  const toggleMobileMenu = () => setMobileOpen(!mobileOpen);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 backdrop-blur-lg bg-gradient-to-r from-pink-50/90 via-white/70 to-pink-50/90 shadow-xl animate-fade-in-down">
        <div className="max-w-7xl mx-auto h-24 flex justify-between items-center px-6 md:px-10">
          {/* Mobile */}
          <div className="flex items-center md:hidden w-full">
            <button
              onClick={toggleMobileMenu}
              className="text-2xl text-black hover:text-sky-400 transition transform hover:scale-110"
            >
              {mobileOpen ? <FaTimes /> : <FaBars />}
            </button>
            {logo && (
              <div
                className="relative ml-4 animate-bounce"
                style={{ width: 70, height: 70 }}
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
            <div className="flex items-center gap-4 ml-auto text-black">
              <Link href="/search">
                <FaSearch className="text-lg hover:scale-125 transition-all" />
              </Link>
              <Link href="/addtocarts">
                <FaShoppingCart className="text-lg hover:scale-125 transition-all" />
              </Link>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden md:flex justify-between items-center w-full">
            {/* Logo */}
            <Link href="/home" className="flex items-center">
              {logo && (
                <div
                  className="relative animate-bounce"
                  style={{ width: 150, height: 70 }}
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
            <nav className="flex items-center gap-16 text-lg font-bold tracking-widest uppercase">
              {navItems.map((item) => {
                const route = `/${item.toLowerCase()}`;
                const isActive = pathname === route;
                return (
                  <Link
                    key={item}
                    href={route}
                    className="relative group transition-all duration-300"
                    style={{ color: mainColor.text_color }}
                  >
                    {item}
                    <span
                      className={`absolute left-0 bottom-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded bg-sky-400`}
                    ></span>
                  </Link>
                );
              })}
            </nav>

            {/* Icons */}
            <div className="flex items-center gap-6 text-black">
              <Link href="/search">
                <FaSearch className="text-lg hover:scale-125 hover:text-sky-400 transition-all" />
              </Link>
              <Link href="/addtocarts">
                <FaShoppingCart className="text-lg hover:scale-125 hover:text-sky-400 transition-all" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed top-0 left-0 h-screen w-64 bg-gradient-to-b from-pink-50/95 via-white/90 to-pink-100 shadow-2xl p-6 flex flex-col transition-transform duration-500 ease-in-out backdrop-blur-xl animate-slide-in-left">
            <div className="flex items-center justify-between mb-5">
              <h1
                className="text-xl font-bold"
                style={{ color: mainColor.text_color }}
              >
                Menu
              </h1>
              <button onClick={toggleMobileMenu} className="text-2xl">
                <FaTimes style={{ color: mainColor.text_color }} />
              </button>
            </div>
            <ul className="flex flex-col gap-4">
              {navItems.map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-lg font-semibold rounded-lg hover:scale-105 transition-all"
                    style={{
                      color: mainColor.text_color,
                      backgroundColor: "transparent",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor =
                        mainColor.button_hover_color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "transparent")
                    }
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-8 text-sm space-y-2">
              <p
                className="font-semibold mb-2"
                style={{ color: mainColor.text_color }}
              >
                Need help?
              </p>
              <div
                className="flex items-center gap-2"
                style={{ color: mainColor.text_color }}
              >
                <FaPhone size={14} /> +961 71 407 764
              </div>
              <div
                className="flex items-center gap-2"
                style={{ color: mainColor.text_color }}
              >
                <FaEnvelope size={14} /> poupee.dresses1@gmail.com
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer */}
      <div className="mt-28" />
    </>
  );
}
