"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient";

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
  const [colors, setColors] = useState({ text_color: "#2a2a2a" });

  const fetchColors = async () => {
    const { data } = await supabase
      .from("colors")
      .select("*")
      .order("id")
      .limit(1)
      .single();
    if (data) setColors({ text_color: data.text_color });
  };

  useEffect(() => {
    fetchColors();
    window.addEventListener("scroll", handleScrollAnimation);
    handleScrollAnimation();
    return () => window.removeEventListener("scroll", handleScrollAnimation);
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 mt-4" dir="rtl">
      {/* Banner */}
      <div className="mb-6 rounded">
        <img
          src="/images/about1.jpeg"
          alt="مكتبة نجم"
          className="w-full h-[70vh] rounded"
        />
      </div>

      {/* About Text */}
      <div className="text-center mb-6">
        <h3
          className="text-2xl font-semibold mb-4"
          style={{ color: colors.text_color }}
        >
          عن مكتبة نجم
        </h3>
        <p
          className="text-justify leading-7 max-w-4xl mx-auto text-sm sm:text-base"
          style={{ color: colors.text_color }}
        >
          مكتبة نجم هي منصة لبيع الكتب والروايات، تهدف إلى تسهيل وصول القرّاء
          إلى مختلف العناوين الأدبية والثقافية بأسعار مناسبة. نسعى إلى توفير تجربة
          شراء سهلة ومريحة من خلال الطلب الإلكتروني والتوصيل إلى جميع المناطق
          اللبنانية. تركّز مكتبة نجم على جودة الخدمة وتنوّع المحتوى لتلبية أذواق
          القرّاء بمختلف اهتماماتهم. رؤيتنا أن نكون وجهة موثوقة لكل من يبحث عن
          كتاب مميز، ورسالتنا نشر ثقافة القراءة في كل بيت.
        </p>
      </div>

      {/* Section 1 */}
      <section className="flex flex-col sm:flex-row items-center justify-center gap-10 px-4 sm:px-16 py-10">
        {/* Text */}
        <div
          className="sm:w-1/2 text-justify leading-7 text-base animate-scroll"
          style={{ color: colors.text_color }}
        >
          نسعى لتقديم تجربة شراء ممتعة وسهلة، مع توفير معلومات مفصلة عن كل كتاب
          لضمان اختيار القرّاء للكتب التي تناسب اهتماماتهم. مجموعتنا متنوعة
          لتلبي كل الأذواق.
        </div>

        {/* Image */}
        <div className="sm:w-1/2 flex justify-center">
        <img
          src="/images/about2.jpeg"
          alt="كتب ومكتبة"
          className="w-[60vh] h-[60vh] rounded" 
        />
        </div>
      </section>

      {/* Section 2 */}
      <section className="flex flex-col sm:flex-row-reverse items-center justify-center gap-10 px-4 sm:px-16 py-10">
        {/* Text */}
        <div
          className="sm:w-1/2 text-justify leading-7 text-base animate-scroll"
          style={{ color: colors.text_color }}
        >
          نحرص على تقديم تجربة شراء مميزة وسهلة لجميع العملاء، مع توفير وصف دقيق
          لكل كتاب ومعلومات مفصلة لتسهيل عملية الاختيار. اكتشف جمال القراءة مع
          مكتبة نجم.
        </div>

        {/* Image */}
        <div className="sm:w-1/2 flex justify-center">
        <img
          src="/images/about3.jpeg"
          alt="كتب ومكتبة"
          className="w-[60vh] h-[60vh] rounded" 
        />
        </div>
      </section>

      <br />
      <br />
      <br />
    </div>
  );
}
