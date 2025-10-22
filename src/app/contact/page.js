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
    button_hex: "#ec4899", // fallback pink
    button_hover_color: "#f472b6",
    text_color: "#fff",
  };

  return (
    <div className="pt-4 pb-20 font-sans bg-white text-[#2a2a2a]">
      {/* Banner */}
      <div className="w-full h-[300px] relative mb-6">
        <Image
          src="/images/contactus1.jpeg"
          alt="Profile"
          fill
          className="object-cover rounded"
        />
      </div>

      <div className="mx-auto text-center px-4 mb-16">
        <p className="text-base text-[#4a4a4a] leading-relaxed">
          <strong>عن مكتبة نجم</strong>
          <br />
          مكتبة نجم منصة لبيع الكتب والروايات بأسعار مناسبة، مع توصيل لجميع المناطق اللبنانية.  
          هدفنا توفير تجربة شراء سهلة وممتعة ونشر ثقافة القراءة في كل بيت.
        </p>
      </div>

      {/* Form Container */}
      <div className="max-w-[1200px] mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold mb-3 tracking-wide">تواصل معنا</h2>
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
            <label className="block text-m font-bold mb-1">البريد الإلكتروني</label>
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
              className="border-2 font-semibold py-3 px-10 rounded transition duration-300 hover:scale-105"
              style={{
                borderColor: mainColor.button_hex,
                color: mainColor.text_color,
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor = mainColor.button_hover_color)
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              {loading ? "جاري الإرسال..." : "أرسل الرسالة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
