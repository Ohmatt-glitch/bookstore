import { BookStore } from "./components/BookStore";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <BookStore />
    </div>
  );
}
