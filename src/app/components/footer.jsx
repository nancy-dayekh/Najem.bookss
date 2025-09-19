"use client";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
const socialLinks = [
  {
    Icon: FaInstagram,
    url: "https://www.instagram.com/poupee_dresses", // Your Instagram
    title: "Instagram",
  },
  {
    Icon: FaWhatsapp,
    url: "https://wa.me/96171407764", // WhatsApp click-to-chat format with country code and no plus
    title: "WhatsApp",
  },
  {
    Icon: FaEnvelope,
    url: "mailto:poupee.dresses1@gmail.com", // Email link
    title: "Email",
  },
];
export default function Footer() {
  return (
    <footer className="bg-gray-100 text-black pt-16 pb-10 px-4 lg:px-20 mt-14 ">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Poupee Dresses</h2>
          <p className="text-sm text-black ">
            Discover stylish and elegant dresses tailored for every occasion.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h2 className="text-xl font-bold mb-2">Shop</h2>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Home", path: "/" },
              { name: "Products", path: "/products" },
              { name: "About Us", path: "/about" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link href={item.path}>
                  <span className="cursor-pointer hover:text-pink-300 transition-colors">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service Links */}
        <div>
          <h2 className="text-xl font-bold mb-2">Customer Service </h2>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Search", path: "/search" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link href={item.path}>
                  <span className="cursor-pointer hover:text-pink-300 transition-colors">
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us Icons */}
        <div>
          <h2 className="text-xl font-bold mb-3 ">Follow Us</h2>
          <div className="flex gap-2">
            {socialLinks.map(({ Icon, url, title }, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-0 rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                title={title}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p className="text-xs italic text-black mt-4">
            Stay connected with us on social media!
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>
          <p className="text-sm ">
            <strong>Email:</strong> poupee.dresses1@gmail.com
          </p>
          <p className="text-sm mb-2">
            <strong>Phone:</strong> +961 71 407 764
          </p>
          <p className="text-sm">
            <strong>Location:</strong> Abbesiyeh / Tyr, Lebanon
          </p>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center text-xs border-t border-black/30 mt-12 pt-6 text-gray-400">
        © {new Date().getFullYear()} Poupee Dress. All rights reserved.
      </div>
    </footer>
  );
}
