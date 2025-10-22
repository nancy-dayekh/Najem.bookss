"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "../../../lib/supabaseClient"; // عدل المسار حسب المشروع

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
  const [colors, setColors] = useState({ text_color: "#2a2a2a" }); // اللون الافتراضي

  // Fetch colors from database
  const fetchColors = async () => {
    const { data, error } = await supabase
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
    return () => {
      window.removeEventListener("scroll", handleScrollAnimation);
    };
  }, []);

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 mt-4">
      {/* Banner Image */}
      <div className="w-full h-[200px] relative mb-6">
        <Image
          src="/images/about1.jpeg"
          alt="مكتبة نجم"
          fill
          className="object-cover rounded"
        />
      </div>

      {/* ABOUT US Section */}
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
          كتاب مميز، ورسالتنا نشر ثقافة القراءة في كل بيت
        </p>
      </div>

      {/* Responsive Stacked Layout */}
      <div className="flex flex-col sm:grid sm:grid-cols-2 gap-6 items-center mt-10">
        {/* Section 1 Mobile */}
        <div className="block sm:hidden animate-scroll">
          <Image
            src="/images/about2.jpeg"
            alt="كتب ومكتبة"
            width={300}
            height={300}
            className="w-full h-auto rounded shadow-lg object-cover mb-4"
          />
          <p className="text-justify text-sm leading-6 px-2" style={{ color: colors.text_color }}>
            نسعى لتقديم تجربة شراء ممتعة وسهلة، مع توفير معلومات مفصلة عن كل كتاب
            لضمان اختيار القرّاء للكتب التي تناسب اهتماماتهم. مجموعتنا متنوعة
            لتلبي كل الأذواق
          </p>
        </div>

        {/* Section 1 Desktop */}
        <div className="hidden sm:block animate-scroll text-justify px-4 leading-7 text-base ml-32" style={{ color: colors.text_color }}>
          نسعى لتقديم تجربة شراء ممتعة وسهلة، مع توفير معلومات مفصلة عن كل كتاب
          لضمان اختيار القرّاء للكتب التي تناسب اهتماماتهم. مجموعتنا متنوعة
          لتلبي كل الأذواق
        </div>
        <div className="hidden sm:block animate-scroll overflow-hidden h-80">
          <Image
            src="/images/about2.jpeg"
            alt="كتب ومكتبة"
            width={450}
            height={300}
            className="transition-transform duration-300 ease-in-out hover:scale-110 shadow-lg object-cover rounded"
          />
        </div>

        {/* Section 2 Mobile */}
        <div className="block sm:hidden animate-scroll mt-10">
          <Image
            src="/images/about3.jpeg"
            alt="تصفح الكتب"
            width={500}
            height={300}
            className="w-full h-auto rounded shadow-lg object-cover mb-4"
          />
          <p className="text-justify text-sm leading-6 px-2" style={{ color: colors.text_color }}>
            نحرص على تقديم تجربة شراء مميزة وسهلة لجميع العملاء، مع توفير وصف
            دقيق لكل كتاب ومعلومات مفصلة لتسهيل عملية الاختيار. اكتشف جمال
            القراءة مع مكتبة نجم
          </p>
        </div>

        {/* Section 2 Desktop */}
        <div className="hidden sm:block animate-scroll overflow-hidden h-80 ml-32">
          <Image
            src="/images/about3.jpeg"
            alt="تصفح الكتب"
            width={500}
            height={300}
            className="transition-transform duration-300 ease-in-out hover:scale-110 shadow-lg object-cover rounded"
          />
        </div>
        <div className="hidden sm:block animate-scroll text-justify px-4 leading-7 text-base max-w-md" style={{ color: colors.text_color }}>
          نحرص على تقديم تجربة شراء مميزة وسهلة لجميع العملاء، مع توفير وصف
          دقيق لكل كتاب ومعلومات مفصلة لتسهيل عملية الاختيار. اكتشف جمال
          القراءة مع مكتبة نجم
        </div>
      </div>
      <br /><br /><br /><br />
    </div>
  );
}
