"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";

export default function ContactUs() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    comment: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [colors, setColors] = useState(null); // fetch colors from db

  useEffect(() => {
    async function fetchColors() {
      const { data, error } = await supabase
        .from("colors")
        .select("*")
        .order("id");
      if (error) console.error(error);
      else setColors(data?.[0] || null); // take first color row
    }
    fetchColors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!form.name || !form.comment) {
      setErrorMessage("الاسم والتعليق مطلوبان!");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.from("messages").insert([form]);
      if (error) throw error;

      setSuccessMessage("تم إرسال الرسالة بنجاح!");
      setForm({ name: "", phone: "", email: "", comment: "" });
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setErrorMessage(err.message);
      setTimeout(() => setErrorMessage(""), 3000);
    } finally {
      setLoading(false);
    }
  };

  const mainColor = colors || {
    button_hex: "", // fallback pink
    button_hover_color: "#f472b6",
    text_color: "#fff",
  };

  return (
    <div
      className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 mt-4"
      dir="rtl"
    >
      {/* Banner */}
      <div className="mb-6 rounded">
        <img
          src="/images/contactus1e.png"
          alt="Profile"
          className="w-full h-[70vh] rounded"
        />
      </div>

      <div className="mx-auto text-center px-4 mb-16">
        <p className="text-base text-[#4a4a4a] leading-relaxed">
          <strong>عن مكتبة نجم</strong>
          <br />
          مكتبة نجم منصة لبيع الكتب والروايات بأسعار مناسبة، مع توصيل لجميع
          المناطق اللبنانية. هدفنا توفير تجربة شراء سهلة وممتعة ونشر ثقافة
          القراءة في كل بيت.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-3 tracking-wide">
            تواصل معنا
          </h2>
        </div>

        <h3 className="text-2xl font-bold mb-3">أرسل لنا رسالة</h3>
        <p className="text-base text-[#4a4a4a] mb-10">
          نحن هنا للإجابة على استفساراتكم ومساعدتكم في كل ما يتعلق بالكتب.
        </p>

        {/* Success / Error Messages */}
        {successMessage && (
          <p className="text-green-600 mb-4 text-center font-medium">
            {successMessage}
          </p>
        )}
        {errorMessage && (
          <p className="text-red-600 mb-4 text-center font-medium">
            {errorMessage}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-m font-bold mb-1">الاسم</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2"
              style={{ focus: { ringColor: mainColor.button_hex } }}
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-m font-bold mb-1">الهاتف</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2"
              style={{ focus: { ringColor: mainColor.button_hex } }}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-m font-bold mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2"
              style={{ focus: { ringColor: mainColor.button_hex } }}
            />
          </div>

          {/* Comment */}
          <div>
            <label className="block text-m font-bold mb-1">التعليق</label>
            <textarea
              rows={5}
              value={form.comment}
              onChange={(e) => setForm({ ...form, comment: e.target.value })}
              placeholder="رسالتك"
              className="w-full border border-gray-300 px-4 py-3 rounded focus:outline-none focus:ring-2"
              style={{ focus: { ringColor: mainColor.button_hex } }}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="font-bold py-3 px-12 rounded-md transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 relative overflow-hidden group"
              style={{
                background: `linear-gradient(135deg, ${mainColor.button_hex} 0%, ${mainColor.button_hover_color} 100%)`,
                color: mainColor.button_text_color || mainColor.text_color,
                border: `2px solid ${mainColor.button_hex}`,
              }}
            >
              {/* Hover shine overlay */}
              <span
                className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-25 transition-all duration-300 rounded-md"
                style={{ mixBlendMode: "overlay" }}
              ></span>

              <span className="relative">
                {loading ? "جاري الإرسال..." : "أرسل الرسالة"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
