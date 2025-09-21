"use client";
import { useState } from "react";
import {
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaPhone,
  FaEnvelope,
  FaTimes,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = ["Home", "Products", "About", "Contact"];

  return (
    <>
      <header className="fixed top-0 w-full bg-white z-50 shadow-md h-20">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center h-20 md:h-20 px-5">
            {/* MOBILE: Menu + Logo + Icons */}
            <div className="flex md:hidden items-center justify-between ">
              {/* Left: Menu Button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-black text-2xl"
              >
                <FaBars />
              </button>

              {/* Center: Logo */}
              <div className="flex-1 flex justify-center">
                <Image
                  src="/images/logoo.png"
                  alt="Logo"
                  width={110}
                  height={50}
                  priority
                  className="object-contain"
                />
              </div>

              {/* Right: Search + Cart */}
              <div className="flex items-center gap-2 text-black ml-auto">
                <Link
                  href="/search"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <FaSearch className="text-lg text-gray-700 hover:text-pink-500 transition-colors" />
                </Link>
                <Link
                  href="/addtocarts"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <FaShoppingCart className="text-lg text-gray-700 hover:text-pink-500 transition-colors" />
                </Link>
              </div>
            </div>

            {/* DESKTOP: Logo - Nav - Icons */}
            <div className="hidden md:flex justify-between items-center w-full">
              {/* Left: Logo */}
              <Link href="/home" className="flex items-center">
                <Image
                  src="/images/logoo.png"
                  alt="Logo"
                  width={140}
                  height={70}
                  priority
                  className="object-contain"
                />
              </Link>

              {/* Center: Navigation */}
              <nav className="flex items-center gap-14 uppercase font-semibold text-[15px] tracking-wide">
                {navItems.map((item) => {
                  const route = `/${item.toLowerCase()}`;
                  const isActive = pathname === route;
                  return (
                    <Link key={item} href={route} className="relative group">
                      <span className="text-black text-base hover:opacity-90">
                        {item}
                      </span>
                      <span
                        className={`absolute left-0 bottom-[-4px] w-full h-[2px] transition-all ${
                          isActive ? "bg-pink-400" : "group-hover:bg-pink-400"
                        }`}
                      ></span>
                    </Link>
                  );
                })}
              </nav>

              {/* Right: Search + Cart */}
              <div className="flex items-center gap-4 text-black">
                <Link href="/search">
                  <FaSearch className="text-lg" />
                </Link>
                <Link href="/addtocarts">
                  <FaShoppingCart className="text-lg" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed top-0 left-0 h-screen w-64 bg-white z-50 shadow-xl p-6 flex flex-col transition-transform duration-300 ease-in-out">
            {/* Drawer Top: Logo + Close */}
            <div className="flex items-center justify-between mb-4">
                    <h1 className="text-[17px] font-bold text-black">Menu</h1>

              <button
                onClick={() => setMobileOpen(false)}
                className="text-2xl text-black hover:text-pink-500 transition-colors"
              >
                <FaTimes />
              </button>
            </div>

            <hr className="border-gray-200 mb-4" />

            {/* Drawer Navigation */}
            <ul className="flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="flex items-center gap-3 px-4 py-2 text-[17px] font-semibold rounded-lg hover:bg-pink-50 hover:text-pink-500 transition-all"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <hr className="border-gray-200 my-4" />

            {/* Contact Section */}
            <div className="text-gray-700 text-sm space-y-3">
              <p className="font-semibold text-[15px]">Need help?</p>
              <div className="flex items-center gap-2 hover:text-pink-500 transition-colors cursor-pointer">
                <FaPhone size={14} />
                <span>+961 71 407 764</span>
              </div>
              <div className="flex items-center gap-2 hover:text-pink-500 transition-colors cursor-pointer">
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
