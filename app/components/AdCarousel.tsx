"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, BookOpen } from "lucide-react";

const ADS = [
  {
    id: 1,
    tag: "ปรัชญาของเรา",
    title: "คัดสรรมาเพื่อการสัมผัสแห่งการอ่าน",
    subtitle: "ค้นพบหนังสือใหม่ล่าสุดและวรรณกรรมคลาสสิกเหนือกาลเวลา ที่เราคัดสรรมาอย่างพิถีพิถันสำหรับผู้ที่หาแหล่งพักพิงภายในหน้ากระดาษของเรื่องราวเรื่องเยี่ยม",
    action: "เลือกดูทั้งหมด",
    color: "bg-rust",
    isPrimary: true,
  },
  {
    id: 2,
    tag: "พิเศษ",
    title: "ป่าสุดท้าย: ฉบับลายเซ็นมีจำนวนจำกัด",
    subtitle: "การสำรวจป่าโบราณที่หลงเหลือเป็นช่วงสุดท้าย และความลับที่มันเก็บซ่อนเอาไว้",
    action: "สั่งซื้อเดี๋ยวนี้",
    color: "bg-stone-800",
  },
  {
    id: 3,
    tag: "ชุมชน",
    title: "เข้าร่วม Sanctuary Reading Club รับข้อมูลข่าวสารทุกสัปดาห์",
    subtitle: "เชื่อมต่อกับคนรักการอ่านและรับเนื้อหาสุดพิเศษทุกวันศุกร์",
    action: "เข้าร่วมฟรี",
    color: "bg-teal-heavy",
  },
];

export const AdCarousel: React.FC = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % ADS.length);
    }, 8000); // 8 seconds for a better reading experience
    return () => clearInterval(timer);
  }, []);

  const next = () => setCurrent((prev) => (prev + 1) % ADS.length);
  const prev = () => setCurrent((prev) => (prev - 1 + ADS.length) % ADS.length);

  return (
    <div className="relative overflow-hidden rounded-3xl bg-white shadow-2xl shadow-stone-200 ring-1 ring-stone-100">
      <div
        className="flex transition-transform duration-1000 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {ADS.map((ad) => (
          <div key={ad.id} className="w-full flex-shrink-0 p-10 sm:p-16 lg:p-24 flex flex-col md:flex-row md:items-center justify-between gap-12 min-h-[400px]">
            <div className="flex-1 max-w-2xl">
              <div className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-rust opacity-70">
                <Sparkles className="h-4 w-4" />
                {ad.tag}
              </div>
              <h2 className={`mb-6 font-serif font-bold leading-[1.1] text-stone-900 ${ad.isPrimary ? "text-5xl sm:text-7xl" : "text-4xl sm:text-6xl"}`}>
                {ad.isPrimary ? (
                  <>
                    คัดสรรมาเพื่อการ<br />
                    สัมผัสแห่ง<span className="italic text-rust font-normal">การอ่าน</span>
                  </>
                ) : ad.title}
              </h2>
              <p className="max-w-md text-base sm:text-lg italic leading-relaxed text-stone-500 mb-8">
                {ad.subtitle}
              </p>
              <div className="flex gap-4">
                <button className={`rounded-full px-10 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white shadow-xl transition-all hover:scale-105 active:scale-95 ${ad.color}`}>
                  {ad.action}
                </button>
              </div>
            </div>

            {/* Abstract Decorative Element */}
            <div className="hidden lg:flex w-1/3 items-center justify-center">
              <div className="relative">
                <div className={`absolute -inset-4 rounded-full blur-3xl opacity-20 ${ad.color}`} />
                <BookOpen className={`h-48 w-48 opacity-10 transition-colors ${ad.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation - Enhanced */}
      <div className="absolute right-8 bottom-8 flex gap-3">
        <button
          onClick={prev}
          className="rounded-full bg-cream/90 p-3 text-stone-900 shadow-md hover:bg-cream transition-all border border-cream/70"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          className="rounded-full bg-cream/90 p-3 text-stone-900 shadow-md hover:bg-cream transition-all border border-cream/70"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Indicators - Sophisticated */}
      <div className="absolute left-10 sm:left-16 bottom-8 flex gap-2">
        {ADS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1 rounded-full transition-all duration-500 ${current === i ? "w-12 bg-rust" : "w-4 bg-cream/80 hover:bg-cream/90"}`}
          />
        ))}
      </div>
    </div>
  );
};
