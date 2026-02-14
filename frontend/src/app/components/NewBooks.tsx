import { Card, CardContent } from "@/components/ui/card";
import { books } from "@/lib/constant";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";

const NewBooks = () => {
  const [currentBookSlide, setCurrentBookSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBookSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);
  //   You only need useRef if: You want to manually stop/start the interval outside useEffect

  const prevSlide = () => {
    setCurrentBookSlide((prev) => (prev + 1 + 3) % 3);
  };
  const nextSlide = () => {
    setCurrentBookSlide((prev) => (prev + 1) % 3);
  };

  const calculateDiscount = (price: number, finalPrice: number) => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };
  return (
    <section className="py-16  bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          Newly Added Books
        </h2>
        <div className="relative">
          {books.length > 0 ? (
            <>
              <div className="overflow-hidden ">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{
                    transform: `translateX(-${currentBookSlide * 100}%)`,
                  }}
                >
                  {[0, 1, 2].map((book, slideIndex) => (
                    <div key={slideIndex} className="flex-none w-full">
                      <div className="grid  md:grid-cols-3 gap-6">
                        {books
                          .slice(slideIndex * 3, slideIndex * 3 + 3)
                          .map((book) => (
                            <Card key={book._id} className="relative">
                              <CardContent className="p-4">
                                <Link href={`books/${book._id}`}>
                                  <div className="relative">
                                    <Image
                                      src={book.images[0]}
                                      alt="img"
                                      width={200}
                                      height={300}
                                      className="mb-4 h-[200px] w-full object-cover rounded-md"
                                    />
                                    {calculateDiscount(
                                      book.price,
                                      book.finalPrice,
                                    ) > 0 && (
                                      <span className="absolute left-0 top-2 rounded-r-lg py-1 text-xs
                                       bg-red-500 font-medium text-white">
                                        {calculateDiscount(
                                          book.price,
                                          book.finalPrice,
                                        )}
                                        % off
                                      </span>
                                    )}
                                  </div>
                                  <h3 className="mb-2 line-clamp-2 text-sm font-medium">
                                    {book.title}
                                  </h3>
                                  
                                </Link>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewBooks;
