"use client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BookLoader from "@/lib/BookLoader";
import { filters } from "@/lib/constant";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import Pagination from "../components/Pagination";
import NoData from "../components/NoData";
import { useRouter } from "next/navigation";
import { useGetProductsQuery } from "@/store/api";
import { BookDetails } from "@/lib/types/type";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const page = () => {

  const [currentPage, setCurrentPage] = useState(1);
  //
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string[]>([]); // classType
  const [selectedCategory, setSelectedCategory] = useState<string[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);

  const { data: apiResponse = {}, isLoading } = useGetProductsQuery({});

  const [books, setBooks] = useState<BookDetails[]>([]);

  const searchTerms = new URLSearchParams(window.location.search).get("search") || "";
  console.log("searchTerms ==> ",searchTerms)

    const user = useSelector((state: RootState) => state.user.user);
    const router = useRouter()
    useEffect(()=>{
    if(user && user.role!=="user"){
      router.push("/admin")
    }
    },[user,router])
  

  useEffect(() => {
    if (apiResponse.success) {
      setBooks(apiResponse.data);
    }
  }, [apiResponse]);
  //


  //
  const [sortOption, setSortOption] = useState<string>("newest");

  const bookPerPage = 6;

  // section : "condition" , item : "good"
  const toggleFilter = (section: string, item: string) => {

    const updateFilter = (prev: string[]) => {
      console.log("prev ==> ",prev)
      return prev.includes(item) ? prev.filter( el => el !== item) : [...prev, item];
      // [].includes("good") ?  prev.filter((i) => i !== item) : [...prev, "good" ];
    };

    // section = "condition"
    switch (section) {

      case "condition":
        setSelectedCondition((prev) => updateFilter(prev)); // prev is old array
        break;

      case "classType":
        setSelectedType((prev) => updateFilter(prev));
        break;

      case "category":
        setSelectedCategory((prev) => updateFilter(prev));
        break;
    }

    setCurrentPage(1);
  };

  const filterBooks = books.filter((book) => {
    // if ["fair"] in selected condition
    // [ {"title":"eng",condition:"good"} , {"title":"hin",condition:"fair"}  ] is books
    // then false for this ==> {"title":"eng",condition:"good"} book.
    const conditionMatch = selectedCondition.length === 0 ||
      selectedCondition.some( (cond) => cond.toLowerCase() === book.condition.toLowerCase() );
    
    console.log("condition matched ==> ",conditionMatch)

    const typeMatch = selectedType.length === 0 ||
      selectedType.some( (type) => type.toLowerCase() === book.classType.toLowerCase() );

    const categoryMatch = selectedCategory.length === 0 ||
      selectedCategory.some( (cat) => cat.toLowerCase() === book.category.toLowerCase() );

    // "hello world".includes("ell")  // true but ["hello", "world"].includes("hell") // false ==> exact element for array
    const searchMatch = searchTerms ? book.title.toLowerCase().includes(searchTerms.toLowerCase())
    || book.author?.toLowerCase().includes(searchTerms.toLowerCase())
    || book.subject?.toLowerCase().includes(searchTerms.toLowerCase()) : true

    console.log("search match ==> ",searchMatch)
    console.log("conditionMatch && typeMatch && categoryMatch && searchMatch ==> ",conditionMatch && typeMatch && categoryMatch && searchMatch)

    return conditionMatch && typeMatch && categoryMatch && searchMatch

  });

  console.log("filtered books ==> ",filterBooks)

  //date
  // ... ==> Because .sort() changes the original array.
  const sortedBooks = [...filterBooks].sort((a, b) => {

    switch (sortOption) {

      case "newest":
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case "oldest":
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

      case "price-low":
        return a.finalPrice - b.finalPrice;

      case "price-high":
        return b.finalPrice - a.finalPrice;

      default:
        return 0;
    }

  });

  //pagination ==> 12 / 6 is 2 pages
  const totalPages = Math.ceil(sortedBooks.length / bookPerPage);
  
  // [0,1,2,3,4,5,6,7,8,9,10,11] length is 12
  // 1-1 * 6 , 1 * 6 ==> 0, 6
  // 2-1 * 6 , 2 * 6 ==> 6, 12
  const paginatedBooks = sortedBooks.slice( (currentPage - 1) * bookPerPage, currentPage * bookPerPage );

  const handlePageChange = (page: number) => { setCurrentPage(page) };

  const calculateDiscount = (price: number, finalPrice: number): number => {
    if (price > finalPrice && price > 0) {
      return Math.round(((price - finalPrice) / price) * 100);
    }
    return 0;
  };

  const formatDate = (dateString: Date) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  //

  return (
    <>
      <div className="min-h-screen bg-gray-100">

        <div className="container mx-auto px-4 py-2">

          <nav className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">

            <Link href={"/"} className="text-primary hover:underline">
              Home
            </Link>

            <span>/</span>
            <span>Books</span>

          </nav>

       

          <div className="grid gap-8 md:grid-cols-[280px_1fr]">

            {/* grid-cols-[280px_1fr] → creates 2 columns : First column: 280px  */}
            {/* Second column: 1fr → takes the remaining available space */}

             {/* accordion */}
            <div className="">

              <Accordion type="multiple" className="bg-white p-2 border rounded-lg">

                {Object.entries(filters).map( ([key, values])  => (

                  <AccordionItem key={key} value={key}>

                    <AccordionTrigger className="text-md font-semibold text-gray-500">
                      {key.charAt(0).toUpperCase() + key.slice(1)} 
                    </AccordionTrigger>

                    <AccordionContent>

                      <div className="space-y-2 mt-2">

                        {values.map((val) => (

                          <div key={val} className="flex items-center space-x-2">

                            <Checkbox
                              id={val}
                              onCheckedChange={() => toggleFilter(key, val)}
                              checked={
                                key === "condition"
                                  ? selectedCondition.includes(val)
                                  : key === "classType"
                                    ? selectedType.includes(val)
                                    : selectedCategory.includes(val)
                              }
                            />

                            <label
                              htmlFor={val}
                              className="text-sm font-medium leading-none"
                            >
                              {val}
                            </label>

                          </div>

                        ))}

                      </div>

                    </AccordionContent>
                    {/* accordion content ends */}
                    
                  </AccordionItem>

                ))}

              </Accordion>

            </div>
            {/* accordion */}

            {/*1fr  */}
         
            <div className="space-y-2">

              {/* condition1 ? value1 : condition2 ? value2 : defaultValue */}

              {isLoading ? (

                <BookLoader />

              ) : paginatedBooks.length ? (

                <>

                  {/* heading and select */}
                  <div className="flex justify-between items-center">

                    <div className=" md:text-lg font-semibold text-black/70">
                      Buy Second hand books, used books Online!
                    </div>

                    <Select value={sortOption} onValueChange={setSortOption}>

                      <SelectTrigger className="w-[150px]">

                        <SelectValue
                          placeholder="Sort By"
                       
                        />

                      </SelectTrigger>

                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="oldest">Oldest</SelectItem>
                        <SelectItem value="price-low">Low to High</SelectItem>
                        <SelectItem value="price-high">High to Low</SelectItem>
                      </SelectContent>

                    </Select>

                  </div>
                  {/* heading and select ends  */}

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

                    {paginatedBooks.map((book) => (

                      <motion.div
                        key={book._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }} // animate is the target/final state that Framer Motion animates toward.
                        // exit={{ opacity: 0, y: -10 }} 
                        // when navigating to another page/component, exit can be used to animate.
                        // For exit animations, you generally need AnimatePresence.
                        // AnimatePresence detects that the component is about to be removed and keeps it temporarily in the DOM:
                        transition={{ duration: 0.3 }}
                      >

                        <Card
                          className="group relative overflow-hidden rounded-lg
                          duration-500 hover:shadow-2xl bg-white border-0"
                        >

                          <CardContent className="p-0">

                            <Link href={`books/${book._id}`}>

                              <div className="relative">

                                <Image
                                  src={book.images[0]}
                                  alt={book.title}
                                  width={400}
                                  height={300}
                                  className="h-[250px] w-full object-cover  duration-300 group-hover:scale-95"
                                  // group is normally placed on the parent, and group-hover:* is placed on the child.
                                />

                                <div className="absolute left-6 top-0 -translate-x-1/2 -translate-y-1/2">

                                  {calculateDiscount(book.price, book.finalPrice ) > 0 && (

                                    <Badge className="bg-orange-600/90 text-white hover:bg-orange-700">
                                      {calculateDiscount(
                                        book.price,
                                        book.finalPrice,
                                      )}
                                      % off
                                    </Badge>
                                  )}

                                </div>

                         
                              </div>

                              <div className="p-4 space-y-2">

                               
                                  <h3 className="text-lg font-semibold text-orange-500 line-clamp-1">
                                    {book.title}
                                  </h3>
                               

                                <p className="text-sm text-zinc-400">
                                  {book.author}
                                </p>

                                <div className="flex items-baseline gap-2">

                                  <span className="text-2xl font-bold text-black ">
                                    ₹ {book.finalPrice}
                                  </span>

                                  {book.price && (
                                    <span className="text-sm text-zinc-500 line-through">
                                      ₹ {book.price}
                                    </span>
                                  )}

                                </div>

                                <div className="flex justify-between text-center text-xs text-zinc-400">

                                  <span>{formatDate(book.createdAt)}</span>
                                  <span>{book.condition}</span>
                                  
                                </div>

                              </div>

                            </Link>

                          </CardContent>

                        </Card>

                      </motion.div>

                    ))}

                  </div>

                  {/* pagination */}
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />

                </>
              ) : (

                <NoData
                  imageUrl="/images/no-book.jpg"
                  message="No Books available please try again."
                  description="Try adjusting your filters or search criteria to find what you are looking for."
                  onClick={() => router.push("/book-sell")}
                  ButtonText="Sell your first book."
                />

              )}

            </div>

            {/* 1fr  */}

          </div>



        </div>

      </div>
    </>
  );
};

export default page;
