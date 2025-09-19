"use client";

import { useEffect } from "react";
import Image from "next/image";

// Scroll animation function
const handleScrollAnimation = () => {
  const elements = document.querySelectorAll(".animate-scroll");
  elements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top <= window.innerHeight) {
      el.classList.add("scroll-in");
    } else {
      el.classList.remove("scroll-in");
    }
  });
};

export default function About() {
  useEffect(() => {
    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation();
    return () => {
      window.removeEventListener("scroll", handleScrollAnimation);
    };
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 mt-4">
      {/* Banner Image */}
      <div className="w-full h-[200px] relative mb-6">
        <Image
          src="/images/logoo.png"
          alt="Profile"
          fill
          className="object-cover rounded"
        />
      </div>

      {/* ABOUT US Section */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">ABOUT US</h3>
        <p className="text-gray-600 text-justify leading-7 max-w-4xl mx-auto text-sm sm:text-base">
          Welcome to <strong>Poupee Dress</strong>, your ultimate destination
          for elegant and high-quality baby girl clothing. We specialize in
          crafting charming dresses that combine comfort and style, ensuring
          your little princess looks adorable for every occasion. Thank you for
          choosing <strong>Poupee Dress</strong> to be part of your cherished
          moments.
        </p>
      </div>

      {/* Responsive Stacked Layout on Mobile */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 items-center mt-10">
        {/* Mobile: Image Top, Text Bottom */}
        {/* Desktop: Text Left, Image Right */}

        {/* Section 1 */}
        <div className="block sm:hidden animate-scroll">
          <Image
            src="/images/pictureabout1.jpg"
            alt="Elegant Dress"
            width={300}
            height={300}
            className="w-full h-auto rounded shadow-lg object-cover mb-4"
          />
          <p className="text-justify text-sm leading-6 px-2">
            Our dresses are meticulously crafted with intricate details, from
            soft fabrics to elegant trims, ensuring your baby girl feels
            comfortable and beautiful. Each dress blends sophistication and
            playfulness, offering styles for different occasions.
          </p>
        </div>

        {/* Section 1 for Desktop */}
        <div className="hidden sm:block animate-scroll text-justify px-4 leading-7 text-base ml-32">
          Our dresses are meticulously crafted with intricate details, from soft
          fabrics to elegant trims, ensuring your baby girl feels comfortable
          and beautiful. Each dress blends sophistication and playfulness,
          offering styles for different occasions.
        </div>
        <div className="hidden sm:block animate-scroll overflow-hidden h-80">
          <Image
            src="/images/pictureabout1.jpg"
            alt="Elegant Dress"
            width={450}
            height={300}
            className="transition-transform duration-300 ease-in-out hover:scale-110 shadow-lg object-cover rounded"
          />
        </div>

        {/* Section 2 */}
        <div className="block sm:hidden animate-scroll mt-10">
          <Image
            src="/images/pictureabout2.jpg"
            alt="Stylish Baby Dress"
            width={500}
            height={300}
            className="w-full h-auto rounded shadow-lg object-cover mb-4"
          />
          <p className="text-justify text-sm leading-6 px-2">
            We are committed to providing an exceptional shopping experience
            with easy navigation and detailed product descriptions, ensuring
            that every customer finds the perfect dress for their little one.
            Discover the beauty of childhood with <strong>Poupee Dress</strong>.
          </p>
        </div>

        {/* Section 2 for Desktop */}
        <div className="hidden sm:block animate-scroll overflow-hidden h-80 ml-32">
          <Image
            src="/images/pictureabout2.jpg"
            alt="Stylish Baby Dress"
            width={500}
            height={300}
            className="transition-transform duration-300 ease-in-out hover:scale-110 shadow-lg object-cover rounded"
          />
        </div>
        <div className="hidden sm:block animate-scroll text-justify px-4 leading-7 text-basemax-w-md max-w-120">
          We are committed to providing an exceptional shopping experience with
          easy navigation and detailed product descriptions, ensuring that every
          customer finds the perfect dress for their little one. Discover the
          beauty of childhood with <strong>Poupee Dress</strong>.
        </div>
      </div>
      <br/><br/><br/><br/>
    </div>
  );
}
