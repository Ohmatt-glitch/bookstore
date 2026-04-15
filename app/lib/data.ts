export interface Book {
  id: number;
  title: string;
  author: string;
  price: number;
  category: "อีบุ๊ก" | "หนังสือเสียง" | "นิยาย";
  image: string;
  synopsis: string;
  format: string;
  specs: string;
}

export const books: Book[] = [
  {
    id: 1,
    title: "ป่าสุดท้าย",
    author: "Eleanor Whitemore",
    price: 19.99,
    category: "นิยาย",
    image: "/image/superman2png.png",
    synopsis: "การสำรวจป่าโบราณที่หลงเหลือเป็นช่วงสุดท้าย และความลับที่มันเก็บซ่อนเอาไว้",
    format: "ปกแข็ง",
    specs: "312 หน้า, 6 x 9 นิ้ว"
  },
  {
    id: 2,
    title: "ความเงียบแห่งกระแสน้ำ",
    author: "Marcus Thorne",
    price: 24.50,
    category: "นิยาย",
    image: "/image/superman_png.png",
    synopsis: "มหากาพย์ทางทะเลอันกว้างใหญ่ที่มีฉากหลังเป็นเมืองชายฝั่งทะเลอันขรุขระในศตวรรษที่ 19",
    format: "ปกแข็ง",
    specs: "420 หน้า, 6.2 x 9.5 นิ้ว"
  },
  {
    id: 3,
    title: "สถาปัตยกรรมกระดาษ",
    author: "S. J. Aris",
    price: 18.00,
    category: "อีบุ๊ก",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=800&q=80",
    synopsis: "การศึกษาที่ซับซ้อนของโครงสร้างที่มีอยู่บนหน้ากระดาษและในจินตนาการเท่านั้น",
    format: "ดิจิทัล (EPUB/PDF)",
    specs: "เทียบเท่า 150 หน้า, 12MB"
  },
  {
    id: 4,
    title: "ห้องเรียนของนักเล่นแร่แปรธาตุ",
    author: "Lara Finch",
    price: 32.99,
    category: "หนังสือเสียง",
    image: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=800&q=80",
    synopsis: "การเดินทางอันลึกลับเข้าสู่โลกแห่งวิทยาศาสตร์โบราณและภูมิปัญญาที่ถูกลืม",
    format: "เสียง (ดาวน์โหลดดิจิทัล)",
    specs: "11 ชั่วโมง 20 นาที, บรรยายโดย Sarah Greene"
  },
  {
    id: 5,
    title: "เสียงสะท้อนแห่งฝุ่นพลบ",
    author: "Robert Graves",
    price: 15.75,
    category: "นิยาย",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    synopsis: "เรื่องเล่าเชิงกวีเกี่ยวกับความทรงจำ ความสูญเสีย และความงามที่พบได้ในชั่วขณะธรรมดาๆ",
    format: "ปกอ่อน",
    specs: "245 หน้า, 5.5 x 8.5 นิ้ว"
  },
  {
    id: 6,
    title: "เสียงกระซิบของต้นสน",
    author: "Julianne Moss",
    price: 21.00,
    category: "หนังสือเสียง",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80",
    synopsis: "คอลเลกชันเรื่องราวอันแสนผ่อนคลายที่มีฉากในกระท่อมกลางป่าอันห่างไกล เหมาะสำหรับช่วงเย็นที่เงียบสงบ",
    format: "เสียง (MP3)",
    specs: "6 ชั่วโมง 45 นาที, บรรยายโดย Julianne Moss"
  },
  {
    id: 7,
    title: "ประตูยามเช้า",
    author: "Thomas K. Vance",
    price: 27.50,
    category: "นิยาย",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    synopsis: "เรื่องราวเชิงเปรียบเทียบเกี่ยวกับการค้นพบและเกณฑ์ช่วงวัยที่เราข้ามผ่านในชีวิต",
    format: "ปกแข็ง",
    specs: "280 หน้า, 6 x 9 นิ้ว"
  },
  {
    id: 8,
    title: "หมึกเที่ยงคืน",
    author: "Clarice Hart",
    price: 14.99,
    category: "อีบุ๊ก",
    image: "https://images.unsplash.com/photo-1463320726281-1b24b7d83942?auto=format&fit=crop&w=800&q=80",
    synopsis: "เรื่องลึกลับที่น่าติดตามเกี่ยวกับนักเขียนตัวละครสมมติที่มีคดีอาชญากรรมสะท้อนถึงเหตุการณ์จริง",
    format: "ดิจิทัล (EPUB)",
    specs: "เทียบเท่า 305 หน้า, 4.5MB"
  },
  {
    id: 9,
    title: "วิถีของความสำเร็จ",
    author: "Mila Hart",
    price: 22.00,
    category: "อีบุ๊ก",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    synopsis: "เคล็ดลับการตั้งเป้าหมายและสร้างวินัยเพื่อชีวิตที่มีผลลัพธ์มากขึ้น",
    format: "ดิจิทัล (EPUB)",
    specs: "เทียบเท่า 220 หน้า, 8MB"
  },
  {
    id: 10,
    title: "พลังของความคิดเชิงบวก",
    author: "Ari Chen",
    price: 18.50,
    category: "หนังสือเสียง",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80",
    synopsis: "หนังสือเสียงเพื่อเติมพลังความคิดและสร้างนิสัยใหม่ให้เป็นคนที่ดีกว่าเดิม",
    format: "เสียง (MP3)",
    specs: "8 ชั่วโมง 30 นาที, บรรยายโดย Ari Chen"
  },
  {
    id: 11,
    title: "กลยุทธ์เวลาอันมีค่า",
    author: "Lina Song",
    price: 20.25,
    category: "นิยาย",
    image: "https://images.unsplash.com/photo-1528200147179-8a9a1e6e665e?auto=format&fit=crop&w=800&q=80",
    synopsis: "เรื่องเล่าแรงบันดาลใจเกี่ยวกับการเรียนรู้จัดการเวลาและใช้ชีวิตเต็มประสิทธิภาพ",
    format: "ปกแข็ง",
    specs: "310 หน้า, 6 x 9 นิ้ว"
  },
  {
    id: 12,
    title: "ค้นหาความหมายในทุกวัน",
    author: "Noah Lee",
    price: 17.80,
    category: "อีบุ๊ก",
    image: "https://images.unsplash.com/photo-1496104679561-38b7e875c7e0?auto=format&fit=crop&w=800&q=80",
    synopsis: "คู่มือฉบับย่อเพื่อตั้งคำถามและค้นหาความหมายในชีวิตประจำวัน",
    format: "ดิจิทัล (PDF)",
    specs: "เทียบเท่า 180 หน้า, 7MB"
  },
  {
    id: 13,
    title: "ศิลปะแห่งการฟัง",
    author: "Eva Sorensen",
    price: 21.99,
    category: "หนังสือเสียง",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    synopsis: "หนังสือเสียงที่จะสอนให้คุณฟังและเข้าใจคนรอบข้างได้อย่างลึกซึ้ง",
    format: "เสียง (ดาวน์โหลดดิจิทัล)",
    specs: "10 ชั่วโมง 15 นาที, บรรยายโดย Eva Sorensen"
  },
  {
    id: 14,
    title: "นิสัยคนสำเร็จ",
    author: "Jordan Kim",
    price: 25.00,
    category: "นิยาย",
    image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=800&q=80",
    synopsis: "นิยายเชิงสร้างแรงบันดาลใจเกี่ยวกับผู้คนที่สร้างนิสัยดีเพื่อเปลี่ยนชีวิต",
    format: "ปกแข็ง",
    specs: "340 หน้า, 6 x 9 นิ้ว"
  },
  {
    id: 15,
    title: "ข้ามกำแพงแห่งความกลัว",
    author: "Noemi Ruiz",
    price: 19.49,
    category: "อีบุ๊ก",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80",
    synopsis: "แนวทางฝึกใจให้กล้ารับความท้าทายในทุกด้านของชีวิต",
    format: "ดิจิทัล (EPUB)",
    specs: "เทียบเท่า 200 หน้า, 9MB"
  },
  {
    id: 16,
    title: "เสียงแห่งการเปลี่ยนแปลง",
    author: "Emma Rains",
    price: 23.00,
    category: "หนังสือเสียง",
    image: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    synopsis: "แรงพลังกระตุ้นให้คุณเริ่มเปลี่ยนตัวเอง และเดินหน้าสู่เป้าหมายใหม่",
    format: "เสียง (MP3)",
    specs: "9 ชั่วโมง 40 นาที, บรรยายโดย Emma Rains"
  },
  {
    id: 17,
    title: "รากฐานการตัดสินใจดี",
    author: "Victor Dahl",
    price: 18.99,
    category: "นิยาย",
    image: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=800&q=80",
    synopsis: "เรื่องเล่าเชิงเปรียบเทียบที่จะช่วยให้คุณคิดอย่างเป็นระบบและตัดสินใจมั่นใจ",
    format: "ปกอ่อน",
    specs: "290 หน้า, 5.5 x 8.5 นิ้ว"
  },
  {
    id: 18,
    title: "เล่มเล็กๆ ของความกล้า",
    author: "Aisha Patel",
    price: 14.90,
    category: "อีบุ๊ก",
    image: "https://images.unsplash.com/photo-1496104679561-38b7e875c7e0?auto=format&fit=crop&w=800&q=80",
    synopsis: "บทเรียนสั้นๆ สำหรับฝึกทักษะความกล้าและความมั่นใจทุกวัน",
    format: "ดิจิทัล (PDF)",
    specs: "เทียบเท่า 130 หน้า, 5MB"
  },
  {
    id: 19,
    title: "ความสุขในวิถีเรียบง่าย",
    author: "Noel Tan",
    price: 16.75,
    category: "นิยาย",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    synopsis: "นิยายแสนอ่อนโยนเกี่ยวกับคนที่ค้นพบความสุขจากชีวิตที่เรียบง่าย",
    format: "ปกแข็ง",
    specs: "265 หน้า, 6 x 9 นิ้ว"
  },
  {
    id: 20,
    title: "การเริ่มต้นใหม่ทุกเช้า",
    author: "Maya Brooks",
    price: 17.25,
    category: "หนังสือเสียง",
    image: "https://images.unsplash.com/photo-1528200147179-8a9a1e6e665e?auto=format&fit=crop&w=800&q=80",
    synopsis: "เพลย์ลิสต์เสียงสำหรับสร้างนิสัยดีและเริ่มวันใหม่อย่างมีแรงบันดาลใจ",
    format: "เสียง (MP3)",
    specs: "7 ชั่วโมง 50 นาที, บรรยายโดย Maya Brooks"
  }
];
