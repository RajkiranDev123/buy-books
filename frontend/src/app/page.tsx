"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
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
import NewBooks from "./components/NewBooks";
import { Card, CardContent } from "@/components/ui/card";

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
      <main className="min-h-screen">
        {/* section 1 */}
        <section className="relative  h-[600px] overflow-hidden rounded-xs">
          {bannerImages?.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 rounded-xs transition-opacity duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"} `}
            >
              <Image
                src={image}
                className="object-cover rounded-sm"
                fill
                alt="banner"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/50 rounded-xs" />
            </div>
          ))}

          {/*  */}
          <div className="relative  mx-auto container px-4 h-full justify-center items-center text-center text-white flex flex-col">
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
        {/* section 1 ends */}

        {/* section 2 starts : newly added books and explore all books button*/}

        <section>
          <NewBooks />

          {/* mb-10 → pushes next element down
             mt-10 → pushes the element itself down */}

          {/* Box 1
                       <-- 40px space above Box 2 from mt-10
                 Box 2
                 Box 3 */}

          {/* Box 1
              Box 2
                   <-- 40px space from mb-10
              Box 3 */}

          <Button
            className="flex mt-10 mb-10 mx-auto bg-yellow-500 px-8 py-6 rounded-xl cursor-pointer"
          >
            <Link href={"/books"}>
              <div className="text-sm"> Explore All Books</div>
            </Link>
          </Button>
        </section>

        {/* section 2 starts : newly added books and explore all books button*/}

        {/* section 3 : how to sell */}

        <section className="py-16 bg-amber-50">
          <div className="container mx-auto px-4">
            <div className="text-center  mb-4">
              <h2 className="text-3xl font-bold mb-4">
                How to sell your old books online!
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto ">
                Saving some good amount of money by buying used books is just 3
                steps away from you!
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div
                className="hidden md:block bg-amber-800 absolute top-1/2
               left-1/4 right-1/4 h-0.5 b0rder-t-2 border-dashed border-gray-300 "
              />
              {sellSteps?.map((step, index) => (
                <div key={index} className=" relative flex flex-col h-full">
                  <div className="bg-white rounded-xl p-8 shadow-lg text-center flex-grow flex flex-col">
                    <div
                      className="absolute top-2 left-14 -translate-x-1/2 bg-yellow-400
                       text-gray-900 px-4 py-1 rounded-full text-sm font-medium z-10"
                    >
                      {step.step}
                    </div>
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm flex-grow">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        {/* section 3 : how to sell ends*/}

        {/*how to buy  : section 4 */}

        <section className="py-16 bg-linear-to-r from-gray-200 to-white">
          <div className="container  px-4">
            <div className="text-center  mb-4">
              <h2 className="text-3xl font-bold mb-4">
                How to buy old books online!
              </h2>
              {/* mx-auto : It centers the element itself, not the text. */}
              <p className="text-gray-600 max-w-2xl mx-auto ">
                Saving some good amount of money by buying used books is just 3
                steps away from you!
              </p>
            </div>
            {/* grid */}
            <div className="grid md:grid-cols-3 gap-8 relative">
              <div
                className="hidden md:block bg-amber-800 absolute top-1/2 
                h-0.5  border-dashed border-gray-300  left-1/4 right-1/4"
              />
              {/* Stacking in HTML/CSS means which element appears on top when elements overlap. */}
              {/* Later element in HTML Appears on top */}

              {buySteps?.map((step, index) => (
                // h-full : when parent has height
                <div key={index} className=" relative flex flex-col ">
                  <div className="bg-yellow-400 rounded-xl p-8 shadow-lg text-center grow flex flex-col">
                    <div
                      className="absolute top-2 left-14 -translate-x-1/2 bg-white
                       text-gray-900 px-4 py-1 rounded-full text-sm font-medium"
                    >
                      {step.step}
                    </div>
                    <div className="w-16 h-16 mb-2 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                      {step.icon}
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600 text-sm grow">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {/* grid ends */}
          </div>
        </section>

        {/*how to buy ends : section 4 */}

        {/* blog post : section 5*/}
        <section className="py-16 bg-[rgb(223,234,254)]">
          <div className="container px-4 ">
            <h2 className="text-3xl font-bold text-center mb-12">
              Read from our <span className="text-primary">Blog</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <Card key={index} className="hover:shadow-lg p-0 rounded-md">
                  <CardContent className="p-0 flex flex-col ">
                    {/* image */}
                    <div className="relative h-50 overflow-hidden">
                      {/* layout="fill" automatically makes the <Image> absolute ,  make parent relative! */}
                      <Image
                        src={post.imageSrc}
                        alt={post.title}
                        layout="fill"
                        objectFit="cover"
                        className="object-cover transition-transform duration-300 hover:scale-105"
                      />
                      {/*cover : Fill the box, even if I cut some parts off” 
                         contain : Fit the whole image inside the box, maybe some gaps/empty space*/}

                      {/* transition : Both background color (bg-red-500 → bg-blue-500) and transform (scale-105) will animate smoothly over 0.3s. */}
                      {/* transition-transform : Applies transition only to transform-related changes (scale, rotate, translate, skew). */}
                    </div>
                    {/* image ends */}
                    {/*  */}
                    <div className="p-6 flex h-60 flex-col ">
                      {/* grow   : only grows to fill extra space in its parent. Doesn’t shrink.
                          flex-1 : Grow + shrink
                      */}
                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-2 ">
                        <div className="bg=primary/10 p-2 rounded-full ">
                          {post.icon}
                        </div>
                        <span className="">{post.title}</span>
                      </h3>
                      <p className="text-gray-600 text-sm grow">
                        {post.description}
                      </p>
                      <Button
                        variant={"link"}
                        className="flex items-center text-primary grow"
                      >
                        Read more <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* blog post ends: section 5*/}
      </main>
    </>
  );
}
