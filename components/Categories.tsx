"use client";
import { LayoutTextFlip } from "./ui/layout-text-flip";
import Carousel from "./ui/carousel";

const CATEGORIES = [
  {
    name: "Playstation",
    title: "PlayStation",
    button: "Shop Now",
    src: "https://images.unsplash.com/photo-1605559424843-9e4c3feb3a81?w=800&h=800&fit=crop",
  },
  {
    name: "Xbox",
    title: "Xbox",
    button: "Shop Now",
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&h=800&fit=crop",
  },
  {
    name: "VR",
    title: "Virtual Reality",
    button: "Explore VR",
    src: "https://images.unsplash.com/photo-1617638924702-92991de6afeb?w=800&h=800&fit=crop",
  },
  {
    name: "Nintendo",
    title: "Nintendo",
    button: "Shop Now",
    src: "https://images.unsplash.com/photo-1538481572181-98def675b1e8?w=800&h=800&fit=crop",
  },
];

export default function Categories() {
  return (
    <section className="relative py-20 pb-50 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-16">
        <div className="flex flex-row items-center justify-center gap-4 mb-8">
          <LayoutTextFlip
            text="Browse in"
            words={["Playstation", "Xbox", "VR", "Nintendo"]}
            duration={3000}
          />
        </div>
        <p className="text-center text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
          Discover an amazing collection of gaming platforms and accessories.
          From classic consoles to cutting-edge VR experiences, we have
          something for every gamer.
        </p>
      </div>

      {/* Carousel Section */}
      <div className="relative flex items-center justify-center mt-20">
        <Carousel slides={CATEGORIES} />
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
    </section>
  );
}