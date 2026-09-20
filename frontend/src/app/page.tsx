"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight,BookOpen,Camera,CreditCard,Library,Search,ShoppingBag,Store,Tag,Truck,Wallet} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import NewBooks from "./components/NewBooks";
import { Card, CardContent } from "@/components/ui/card";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";


export default function Home() {

  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter()
  useEffect(()=>{
  if(user && user.role!=="user"){
    router.push("/admin")
  }
  },[user,router])

  const bannerImages = [ "/images/book1.jpg", "/images/book2.jpg", "/images/book1.jpg"];

  const sellSteps = [
    {
      step: "Step 1",
      title: "Post an ad for selling used books",
      description:
        "Post an ad on Buy Books describing your book details to sell your old books online.",
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
        "Search from over thousands of used books listed on Buy Books.",
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

  const blogPosts = [
    {
      imageSrc:
        `https://images.unsplash.com/photo-1604866830893-c13cafa515d5?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=
        M3wxMjA3fDB8MHxzZWFyY2h8NHx8b25saW5lJTIwc2VsbCUyMGJvb2tzfGVufDB8fDB8fHww`,
      title: "Where and how to sell old books online?",
      description:
        "Get started with selling your used books online and earn money from your old books.",
      icon: <BookOpen className="w-6 h-6 text-primary" />,
    },
    {
      imageSrc:
        `https://cdn.shopify.com/s/files/1/0281/3607/9395/files/reading_challenge_26.png?v=1767072323`,
      title: "What to do with old books?",
      description:
        "Learn about different ways to make use of your old books and get value from them.",
      icon: <Library className="w-6 h-6 text-primary" />,
    },
    {
      imageSrc:
        `https://images.unsplash.com/photo-1492539438225-2666b2a98f93?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3
        &ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fG9sZCUyMCUyMGJvb2tzfGVufDB8fDB8fHww`,
      title: "What is Buy Books ?",
      description:
        "Discover how Buy Books helps you buy and sell used books online easily.",
      icon: <Store className="w-6 h-6 text-primary" />,
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
     {/* If the screen is 800px high : Content height = 1000px → div becomes 1000px */}
     {/* So min-h-screen = at least the full screen height, but it can grow taller if the content needs it. */}

      <main className="min-h-screen">

        {/* section 1 */}

        <section className="relative  h-[500px]  rounded-xs">

          {/* banner images */}

          {bannerImages?.map((image, index) => (

            <div
              key={index}
              className={`absolute inset-0 rounded-xs  duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"} `}
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

          {/* banner images ends */}

          {/* heading and two button */}

          <div className="relative  mx-auto container px-4 h-full justify-center items-center text-center text-white flex flex-col">

            <h1 className="text-3xl md:text-4xl font-bold mb-8">
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

          {/* heading and two button */}

        </section>

        {/* section 1 ends */}

        {/* section 2 starts : newly added books and explore all books button*/}

        <section>

          <NewBooks />

          <Button className="flex mt-10 mb-10 mx-auto text-white bg-yellow-400 hover:bg-yellow-500 px-8 py-6 rounded-md duration-700 cursor-pointer">

            <Link href={"/books"}>
              <div className="text-sm"> Explore All Books.</div>
            </Link>
            
          </Button>

        </section>

        {/* section 2 ends : newly added books and explore all books button*/}

        {/* section 3 : how to sell your old books online*/}

        <section className="py-9 bg-amber-50">

          <div className="container mx-auto px-4">
             
             {/* heading */}
            <div className="text-center  mb-4">

              <h2 className="text-3xl font-bold mb-4 text-black/70">
                How to sell your old books online!
              </h2>

              <p className="text-gray-600 max-w-2xl mx-auto ">
                Saving some good amount of money by selling used books is just 3
                steps away from you!
              </p>

            </div>
            {/* heading ends */}

            {/* grid */}

            <div className="grid md:grid-cols-3 gap-8 relative">
               
              {/* self closing div tag */}
              <div
                className="hidden md:block bg-amber-800 absolute top-1/2
               left-1/4 right-1/4 h-0.5"
              />
              {/* self closing div tag */}

              {sellSteps?.map((step, index) => (

                <div
                  key={index}
                  className="bg-white relative rounded-xl p-8 shadow-lg text-center flex flex-col h-full"
                >
                  {/* If the parent’s height = auto (content-based : content grow then height grow) ==> there is no “remaining space”  */}
                  {/* Take the remaining vertical space : grow*/}

                  <div
                    className="absolute top-2 left-14 -translate-x-1/2 bg-yellow-400
                       text-gray-900 px-4 py-1 rounded-full text-sm font-medium "
                  >
                    {step.step}
                  </div>

                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>

                  <h3 className="font-semibold mb-1">{step.title}</h3>

                  <p className="text-gray-600 text-sm grow break-words">
                    {step.description} 
                  </p>
                </div>
              ))}

            </div>

            {/* grid  */}

          </div>

        </section>

        {/* section 3 ends : how to sell your old books online ends*/}

        {/* 4 : how to buy old books online : section 4 */}

        <section className="py-7 bg-linear-to-r from-gray-200 to-white">

          <div className="container mx-auto px-4">

            <div className="text-center  mb-4">
  
              <h2 className="text-3xl font-bold mb-4 text-black/60">
                How to buy old books online!
              </h2>

     
              <p className="text-gray-600 max-w-2xl mx-auto ">
                Saving some good amount of money by buying used books is just 3
                steps away from you!
              </p>

            </div>

            {/* grid */}

            <div className="grid md:grid-cols-3 gap-8 relative">
      
              <div
                className="hidden md:block bg-amber-800 absolute top-1/2 
                h-0.5 left-1/4 right-1/4"
              />

              {/* Stacking in HTML/CSS means which element appears on top when elements overlap. */}
              {/* Later element in HTML Appears on top */}
              {/* line is behind cards (because cards are later (after line) in DOM + normal flow) */}

              {buySteps?.map((step, index) => (
            
                <div key={index} className=" relative  ">

                  <div className="bg-yellow-400 rounded-xl p-8 shadow-lg text-center h-[220px]  flex flex-col">
                
                    <div
                      className="absolute top-2 left-14 -translate-x-1/2 bg-white
                       text-gray-900 px-4 py-1 rounded-full text-sm font-medium"
                    >
                      {/* This shifts the element left by half its own width : -translate-x-1/2 */}
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

        {/* 4 : how to buy old books online ends : section 4 */}

        {/* 5 : read from our blog  : last section 5*/}

        <section className="py-9 bg-gray-200">

          <div className="container mx-auto px-4">

            <h2 className="text-3xl font-bold text-center mb-12 text-black/70">
              Read from our <span className="text-primary/90">Blog!</span>
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
     
              {blogPosts.map((post, index) => (
    
                <Card key={index} className="hover:shadow-lg p-0 rounded-md ">

                  <CardContent className="p-0 flex flex-col relative h-90">
                
                    <div className="relative h-50 overflow-hidden">

                      <Image
                        src={post.imageSrc}
                        alt={post.title}
                        fill
                        className="object-cover  duration-300 hover:scale-105"
                        // object-cover = auto zoom + auto crop
                      />
      
                    </div>
       
                    <div className="p-4 flex  flex-col justify-evenly ">

                      <h3 className="text-xl font-semibold mb-2 flex items-center gap-3">

                        <div className="bg-primary/10 p-2 rounded-full ">
                          {post.icon}
                        </div>

                        <span className="text-md">{post.title}</span>

                      </h3>
                  

                      <p className="text-gray-600 text-sm grow h-20">
                        {post.description}
                      </p>

                
             
                    </div>

                    <Button
                        variant={"link"}
                        className="flex items-center text-primary cursor-pointer absolute bottom-2"
                      >
                        Read more <ArrowRight className="w-4 h-4" />
                    </Button>

                  </CardContent>

                </Card>
              ))}

            </div>

          </div>

        </section>

        {/* 5 : read from our post ends: last section 5*/}

      </main>
    </>
  );
}
