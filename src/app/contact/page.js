import React from "react";
import Image from "next/image";

export default function ContactUs() {
  return (
    <div className="pt-4 pb-20 font-sans bg-white text-[#2a2a2a]">
      {/* Banner */}
    <div className="w-full h-[200px] relative mb-6">
        <Image
          src="/images/logoo.png"
          alt="Profile"
          fill
          className="object-cover rounded"
        />
      </div>

      {/* Intro Text */}
      <div className=" mx-auto text-center px-4 mb-16">
        <p className="text-base text-[#4a4a4a] leading-relaxed">
          We’d love to hear from you! Have questions or want to share your Poupee dresses experience? Drop us a message and let’s chat about all things beauty and more. Your journey to glowing skin starts with a conversation!
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-3 tracking-wide">Let's Connect</h2>
        </div>

        <h3 className="text-2xl font-bold mb-3">Send us an email</h3>
        <p className="text-base text-[#4a4a4a] mb-10">
          Ask us anything! We're here to help.
        </p>

        <form className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-m font-bold mb-1">Name</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-m font-bold mb-1">Phone</label>
            <input
              type="text"
              className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-m font-bold mb-1">Email</label>
            <input
              type="email"
              className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-m font-bold mb-1">Comment</label>
            <textarea
              rows={5}
              placeholder="Your Message"
              className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              className="border-2 border-pink-400 text-pink-400 bg-transparent font-semibold py-3 px-10 rounded transition duration-300 hover:bg-pink-400 hover:text-white"
            >
              Send Message
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
