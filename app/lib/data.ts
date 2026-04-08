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
    image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1589998059171-988d887df646?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1543004218-29471b047944?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1621351123083-b88ead73b762?q=80&w=800&auto=format&fit=crop",
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
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop",
    synopsis: "เรื่องลึกลับที่น่าติดตามเกี่ยวกับนักเขียนตัวละครสมมติที่มีคดีอาชญากรรมสะท้อนถึงเหตุการณ์จริง",
    format: "ดิจิทัล (EPUB)",
    specs: "เทียบเท่า 305 หน้า, 4.5MB"
  }
];
