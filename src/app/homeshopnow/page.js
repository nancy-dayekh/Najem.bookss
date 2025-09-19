"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ComponentOne() {
  const router = useRouter();

  const handleBackToShop = () => {
    router.push("/products");
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between px-4 sm:px-12 py-10 gap-8 sm:gap-6 w-full ">
      {/* Left Section: Text + Button */}
      <div className="w-full sm:w-1/2 text-center sm:text-left">
        <h2 className="text-lg sm:text-2xl font-bold leading-snug mb-3 text-[#1e1e1e]">
          BABY GIRL&apos;S TIMELESS STYLE, EVERY SEASON
        </h2>
        <p className="text-sm sm:text-base mb-6 text-[#555] leading-relaxed max-w-md mx-auto sm:mx-0">
          Embrace the season with chic styles that are made to last.
        </p>
        <button
          onClick={handleBackToShop}
          className="bg-white border border-[#f06292] text-[#f06292] hover:bg-[#fce4ec] px-6 py-2 rounded-md text-sm font-semibold transition duration-300"
        >
          Shop Now
        </button>
      </div>

      {/* Right Section: Image */}
      <div className="w-full sm:w-1/2">
        <div className="w-full rounded-md overflow-hidden">
          <Image
            src="/images/image4.jpg"
            alt="Timeless Style"
            width={600}
            height={400}
            className="w-full h-auto object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
