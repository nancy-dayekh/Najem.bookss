"use client";

import { useEffect, useState } from "react";
import { FaInstagram, FaWhatsapp, FaEnvelope } from "react-icons/fa";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

const socialLinks = [
  {
    Icon: FaInstagram,
    url: "https://www.instagram.com/najem.bookss",
    title: "Instagram",
  },
  {
    Icon: FaWhatsapp,
    url: "https://wa.me/96178804781",
    title: "WhatsApp",
  },
];

export default function Footer() {
  const [colors, setColors] = useState(null);

  useEffect(() => {
    fetchColors();
  }, []);

  async function fetchColors() {
    const { data, error } = await supabase
      .from("colors")
      .select("*")
      .order("id")
      .limit(1)
      .single(); // get first color set
    if (error) console.error("Error fetching colors:", error);
    else setColors(data);
  }

  if (!colors) return <div></div>;

  return (
    <footer
      className="pt-16 pb-10 px-4 lg:px-20 mt-14"
      style={{ backgroundColor: colors.footer_bg, color: colors.text_color }}
    >
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {/* Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold mb-4">
            {colors.brand_name || "Najem Book"}
          </h2>
          <p className="text-sm">
            {colors.footer_text ||
              "Discover a stylish and elegant collection of books suitable for every occasion."}
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
                  <span
                    className="cursor-pointer transition-colors"
                    style={{ color: colors.text_color }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = colors.hover_color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = colors.text_color)
                    }
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Service Links */}
        <div>
          <h2 className="text-xl font-bold mb-2">Customer Service</h2>
          <ul className="space-y-2 text-sm">
            {[
              { name: "Search", path: "/search" },
              { name: "Contact", path: "/contact" },
            ].map((item) => (
              <li key={item.name}>
                <Link href={item.path}>
                  <span
                    className="cursor-pointer transition-colors"
                    style={{ color: colors.text_color }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = colors.hover_color)
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = colors.text_color)
                    }
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Follow Us Icons */}
        <div>
          <h2 className="text-xl font-bold mb-3">Follow Us</h2>
          <div className="flex gap-2">
            {socialLinks.map(({ Icon, url, title }, index) => (
              <a
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-0 rounded-full transition-colors"
                title={title}
                style={{ color: colors.text_color }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = colors.hover_color)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = colors.text_color)
                }
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          <p
            className="text-xs italic mt-4"
            style={{ color: colors.text_color }}
          >
            Stay connected with us on social media!
          </p>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-xl font-bold mb-2">Contact Us</h2>

          <p className="text-sm mb-2" style={{ color: colors.text_color }}>
            <strong>Phone:</strong> +961 71 407 764
          </p>
        </div>
      </div>

      {/* Bottom Text */}
      <div
        className="text-center text-xs border-t mt-12 pt-6"
        style={{ borderColor: colors.text_color }}
      >
        © {new Date().getFullYear()} Najem Book. All rights reserved.
      </div>
    </footer>
  );
}
