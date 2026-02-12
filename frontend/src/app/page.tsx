"use client";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Camera,
  CreditCard,
  Library,
  Search,
  ShoppingBag,
  Store,
  Tag,
  Truck,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const bannerImages = [
    "/images/book1.jpg",
    "/images/book2.jpg",
    "/images/book1.jpg",
  ];

  const blogPosts = [
    {
      imageSrc:
        "https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "Where and how to sell old books online?",
      description:
        "Get started with selling your used books online and earn money from your old books.",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
    },
    {
      imageSrc:
        "https://media.istockphoto.com/id/910384920/photo/kid-reading-near-locked-door.webp?a=1&b=1&s=612x612&w=0&k=20&c=J3FL4ZVORItw_bkLzlVo4WO-xUy22S7Qqbuq2xusNnc=",
      title: "What to do with old books?",
      description:
        "Learn about different ways to make use of your old books and get value from them.",
      icon: <Library className="w-6 h-6 text-primary" />,
    },
    {
      imageSrc:
        "https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww",
      title: "What is BookKart?",
      description:
        "Discover how BookKart helps you buy and sell used books online easily.",
      icon: <Store className="w-6 h-6 text-primary" />,
    },
  ];

  const sellSteps = [
    {
      step: "Step 1",
      title: "Post an ad for selling used books",
      description:
        "Post an ad on BookKart describing your book details to sell your old books online.",
      icon: <Camera className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 2",
      title: "Set the selling price for your books",
      description:
        "Set the price for your books at which you want to sell them.",
      icon: <Tag className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 3",
      title: "Get paid into your UPI/Bank account",
      description:
        "You will get money into your account once you receive an order for your book.",
      icon: <Wallet className="h-8 w-8 text-primary" />,
    },
  ];

  const buySteps = [
    {
      step: "Step 1",
      title: "Select the used books you want",
      description:
        "Search from over thousands of used books listed on BookKart.",
      icon: <Search className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 2",
      title: "Place the order by making payment",
      description:
        "Then simply place the order by clicking on the 'Buy Now' button.",
      icon: <CreditCard className="h-8 w-8 text-primary" />,
    },
    {
      step: "Step 3",
      title: "Get the books delivered at your doorstep",
      description: "The books will be delivered to you at your doorstep!",
      icon: <Truck className="h-8 w-8 text-primary" />,
    },
  ];
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);
  return (
    <>
      <main className="bg-amber-100 min-h-screen">
        <section className="relative bg-amber-400 h-[600px] overflow-hidden">
          {bannerImages?.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-5 transition-opacity duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"} `}
            >
              <Image
                src={image}
                className="object-cover"
                fill
                alt="banner"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}

          {/*  */}
          <div className="relative mx-auto container px-4 h-full justify-center items-center text-center text-white flex flex-col">
            <h1 className="text-4xl md:text-6xl font-bold mb-8">
              Buy & Sell Books Online in India.
            </h1>
            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                size={"lg"}
                className="group bg-gradient-to-r 
                 from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-6 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 p-2 rounded-lg group-hover:bg-white/30 transition-colors">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <Link href={"/books"}>
                    <div className="text-left">
                      <div className="text-sm opacity-90"> Start Shopping</div>
                      <div className="font-semibold"> Buy used Books</div>
                    </div>
                  </Link>
                </div>
              </Button>
              {/*  */}
              <Button
                size={"lg"}
                className="group bg-gradient-to-r 
                 from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 text-black px-8 py-6 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-black/20 p-2 rounded-lg group-hover:bg-black/30 transition-colors">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <Link href={"/book-sell"}>
                    <div className="text-left">
                      <div className="text-sm opacity-90"> Start Selling</div>
                      <div className="font-semibold"> Sell old Books</div>
                    </div>
                  </Link>
                </div>
              </Button>
              {/*  */}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
