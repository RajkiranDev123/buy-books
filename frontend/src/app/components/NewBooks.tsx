
import { Card, CardContent } from "@/components/ui/card";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useGetProductsQuery } from "@/store/api";
import { BookDetails } from "@/lib/types/type";

const NewBooks = () => {

  const [currentBookSlide, setCurrentBookSlide] = useState(0);

  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({});
  // initially data can be undefined 
  // Until the API gives me data, use {} instead
  // It prevents errors like : apiResponse.success

  const [books, setBooks] = useState<BookDetails[]>([]);

  useEffect(() => {
    if (apiResponse.success) {
      setBooks(apiResponse.data);
    }
  }, [apiResponse]);

  useEffect(() => {

    const timer = setInterval(() => {

      setCurrentBookSlide((prev) => (prev + 1) % 3)
      // 1 % 3 = 1 , 2 % 3 = 2 and 3 % 3 = 0 

    }, 500000);

    return () => clearInterval(timer);

  }, []);

  // You only need useRef if : You want to manually stop/start the interval from outside the useEffect.

  const prevSlide = () => { setCurrentBookSlide((prev) => (prev - 1 + 3) % 3) }; // 1 - 1 + 3 % 3 ==> 0 + 3 % 3 ==> 0

  const nextSlide = () => { setCurrentBookSlide((prev) => (prev + 1) % 3) }; // 0 + 1 % 3 ==> 1 % 3 ==> 1

  const calculateDiscount = (price: number, finalPrice: number) => {

    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;

  };

  return (
    <section className="py-5 bg-gray-200">

      <div className="container mx-auto px-7">

        <h2 className="text-2xl font-bold text-center text-gray-500 mb-7">
          Newly Added Books!
        </h2>
        
        
        <div className="relative p-3 ">

          {books.length > 0 ? (

            <>
               {/*loop on books  */}

              <div className="flex transition-transform duration-500 ease-in-out overflow-hidden"
                style={{ transform: `translateX(-${currentBookSlide * 100}%)`}}
                >

                  {[0, 1, 2].map((_, slideIndex) => (

                    <div key={slideIndex} className="flex-none w-full">
            
                      <div className="grid  md:grid-cols-3 gap-6">

                        {books.slice(slideIndex * 3, slideIndex * 3 + 3).map((book) => (

                          // [ a , b , c , d , e , f ]
                          // 0 x 3 , 0 x 3 + 3 ==> 0 , 0 + 3 ==> 0 , 3 ==> 0,1,2 ==> a b c

                          // 1 x 3 , 1 x 3 + 3 ==> 3 , 3 + 6 ==> 3 , 6 ==> 3,4,5 ==> d e f


                            <Card key={book._id} className="relative">

                              <CardContent className="p-5">

                                <Link href={`books/${book._id}`}>

                                  <div className="relative">

                                    <Image
                                      src={book.images[0]}
                                      alt="img"
                                      width={200}
                                      height={300}
                                      className="mb-1 h-[200px] w-full object-cover rounded-md"
                                    />

                                    {/* top left discount  */}
                                    {calculateDiscount( book.price, book.finalPrice) > 0 && (

                                      <span
                                        className="absolute left-0 top-1 rounded-r-lg py-1 px-1 text-xs
                                       bg-red-500 font-medium text-white"
                                      >
                                        {calculateDiscount( book.price, book.finalPrice)}% off
                                      </span>
                                    )}
                                    {/* top left discount  */}

                                  </div>

                                  <h3 className="mb-2 line-clamp-2 text-sm font-medium text-black/80">
                                    {book.title}
                                  </h3>

                                  {/* price etc and quality */}

                                  <div className="flex items-center justify-between">

                                    <div className="flex items-baseline gap-2">
                                      <span className="text-lg font-bold">
                                        ₹ {book.finalPrice}
                                      </span>
                                      {book.price && (
                                        <span className="text-sm text-muted-foreground line-through">
                                          ₹ {book.price}
                                        </span>
                                      )}
                                    </div>

                                    {/*  */}
                                    <div className="flex justify-between items-center text-xs text-zinc-400">
                                      <span>{book.condition}</span>
                                    </div>
                                    {/*  */}

                                  </div>

                                  {/* price etc and quality ends */}

                                  <Button
                                      className="float-start mt-2 bg-linear-to-r from-orange-400 to-orange-600 text-white hover:bg-gradient-to-r
                                     hover:from-orange-600 hover:to-orange-500 cursor-pointer"
                                    >
                                      Buy Now

                                  </Button>

                                </Link>

                              </CardContent>

                            </Card>

                          ))}
                          
                      </div>
                    </div>

                  ))}

              </div>

               {/*loop on books  ends */}
             

              {/* scroll starts*/}

              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow-md"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* scroll ends */}

              {/* dot bottom slide */}

              <div className="mt-8 flex justify-center space-x-4 ">

                {[0, 1, 2].map((dot) => (
                  <button
                    key={dot}
                    onClick={() => setCurrentBookSlide(dot)}
                    className={`h-3 w-3 rounded-full ${currentBookSlide === dot ? "bg-blue-600" : "bg-gray-300"}`}
                  />
                ))}
              </div>

              {/* dot bottom slide ends */}

            </>
          ) : (

            <>
              <p className="text-center text-gray-500">No books to display.</p>
            </>

          )}

        </div>

      </div>

    </section>
  );
};

export default NewBooks;
