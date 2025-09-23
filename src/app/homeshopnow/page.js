"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ComponentOne() {
  const router = useRouter();

  const handleBackToShop = () => {
    router.push("/products");
  };

  return (
    <div className="flex flex-col-reverse sm:flex-row items-center justify-between px-4 sm:px-12 py-10 gap-8 sm:gap-6 w-full">
      {/* Left Section: Text + Button */}
      <div className="w-full sm:w-1/2 text-center sm:text-left lg:ml-20">
        <h2 className="text-lg sm:text-2xl font-bold leading-snug mb-3 text-[#1e1e1e]">
          BABY GIRL&apos;S TIMELESS STYLE, EVERY SEASON
        </h2>
        <p className="text-sm sm:text-base mb-6 text-[#555] leading-relaxed max-w-md mx-auto sm:mx-0">
          Discover chic and elegant styles for your little one that last through every season.
        </p>
        <button
          onClick={handleBackToShop}
          className="bg-white border border-[#f06292] text-[#f06292] hover:bg-[#fce4ec] px-6 py-2 rounded-md text-sm font-semibold transition duration-300"
        >
          Shop Now
        </button>
      </div>

      {/* Right Section: Bigger Image */}
      <div className="w-full sm:w-1/2 flex justify-center">
        <div className="w-60 sm:w-72 md:w-80 lg:w-96 rounded-md overflow-hidden">
          <Image
            src="/images/image4.jpg"
            alt="Timeless Style"
            width={400}
            height={250}
            className="object-cover rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
