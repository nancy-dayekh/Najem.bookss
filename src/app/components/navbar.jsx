"use client";
import { useState } from "react";
import {
  FaBars,
  FaSearch,
  FaShoppingCart,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const navItems = ["Home", "products", "About", "Contact"];

  return (
    <>
      <header className="fixed top-0 w-full bg-white z-50 shadow-md h-20">
        <div className="max-w-7xl mx-auto ">
          <div className="flex justify-between items-center h-20 md:h-20">
            {/* Mobile Menu Icon */}
            <div className="md:hidden flex items-center ml-5">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="text-black text-2xl"
              >
                <FaBars />
              </button>
            </div>

            {/* Logo */}
            <div className="ml-5 mb-3">
              <Image
                src="/images/logoo.png"
                alt="Logo"
                width={130} // or any size that fits your design
                height={80}
                className="mt-2 object-contain"
              />
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-14 uppercase font-semibold text-[15px] tracking-wide mr-10">
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

            {/* Icons */}
            <div className="flex items-center gap-4 mr-7 text-black ">
              <Link href="/search">
                <FaSearch className="text-lg" />
              </Link>
              <Link href="/addtocarts">
                <FaShoppingCart className="text-lg" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-white w-64 h-screen fixed top-0 left-0 z-50 shadow-md p-5 space-y-4">
            <button
              onClick={() => setMobileOpen(false)}
              className="text-black text-xl mb-4"
            >
              ×
            </button>

            <ul className="space-y-4">
              {navItems.map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase()}`}
                    className="block border-b border-gray-300 pb-2 text-black hover:text-red-600"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 text-gray-700 text-sm space-y-2">
              <p className="ml-2 font-semibold">Need help?</p>
              <div className="flex items-center gap-2">
                <FaPhone size={14} />
                <span>+961 71 407 764</span>
              </div>
              <div className="flex items-center gap-2">
                <FaEnvelope size={14} />
                <span>poupee.dresses1@gmail.com</span>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer below header */}
      <div className="mt-24" />
    </>
  );
}
