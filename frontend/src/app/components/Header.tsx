"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
//
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
//
import {
  BookLock,
  ChevronRight,
  FileTerminal,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
  Menu,
  Package,
  PiggyBank,
  SearchIcon,
  ShoppingCart,
  User,
  User2,
} from "lucide-react";
// A collection of SVG icons as React components : lucide-react
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./AuthPage";
import { useGetCartQuery, useLogoutMutation } from "@/store/api";
import toast from "react-hot-toast";

import { setCart } from "@/store/slice/cartSlice";

const Header = () => {

  const [logoutMutation] = useLogoutMutation();


  const [searchTerms, setSearchTerms] = useState("");
 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const router = useRouter();

  const dispatch = useDispatch();

  const isLoginOpen = useSelector((state: RootState) => state.user.isLoginDialogOpen);

  const user = useSelector((state: RootState) => state.user.user);

  const { data: cartData } = useGetCartQuery(user?._id, { skip: !user });

  const cartItemCount = useSelector( (state: RootState) => state.cart.items.length  )





  const userPlaceholder = user?.name
    ?.split(" ") // ["raj","kiran"]
    .map((name: string) => name[0]) //["r","k"]
    .join(""); // "rk"


  const handleSearch = () => {
    router.push(`/books?search=${encodeURIComponent(searchTerms)}`);
    // book & pen
    // Without encoding, the & could be interpreted as the beginning of another query parameter
    // & → %26 , space -> %20 and /books?search=book%20%26%20pen
    // /books?search=book&page=2&sort=price : multiple query parameters
  };

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("Logout done.");
      setIsDropdownOpen(false);
    } catch (error) {
      toast.error("Failed to logout.");
    }
  };

  const handleProtectionNavigation = (href: string) => {
    if (user) {
      router.push(href);
      setIsDropdownOpen(false);
    } else {
      dispatch(toggleLoginDialog());
      setIsDropdownOpen(false);
    }
  };

  // icon label onclick href content
  const menuItems = [
    ...(user
      ? [
          {
            href: "/account/profile",

            content: (

              <div className="flex space-x-4 items-center p-2 border-b">

                <Avatar className="w-12 h-12 -ml-2 rounded-full">

                  {user?.profilePicture ? (

                    <AvatarImage
                      src={user?.profilePicture}
                      alt="user_image"
                    ></AvatarImage>

                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}

                </Avatar>

                <div className="flex flex-col">
                  <span className="font-semibold text-md">{user?.name}</span>

                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>

              </div>

            )
          }
        ]
      : [
          {
            icon: <Lock className="h-5 w-5" />,
            label: "Login / Sign up",
            onclick: () => handleLoginClick(),
          },
        ]),
    {
      icon: <User className="h-5 w-5" />,
      label: "My Profile",
      onclick: () => handleProtectionNavigation("/account/profile"),
    },

    {
      icon: <Package className="h-5 w-5" />,
      label: "My Orders",
      onclick: () => handleProtectionNavigation("/account/orders"),
    },
    {
      icon: <PiggyBank className="h-5 w-5" />,
      label: "My Selling Orders",
      onclick: () => handleProtectionNavigation("/account/selling-products"),
    },
    {
      icon: <ShoppingCart className="h-5 w-5" />,
      label: "Cart",
      onclick: () => handleProtectionNavigation("/checkout/cart"),
    },
    {
      icon: <Heart className="h-5 w-5" />,
      label: "My Wishlist",
      onclick: () => handleProtectionNavigation("/account/wishlist"),
    },
    {
      icon: <User2 className="h-5 w-5" />,
      label: "About Us",
      href: "/about-us",
    },
    {
      icon: <FileTerminal className="h-5 w-5" />,
      label: "Terms & Use",
      href: "/terms-of-use",
    },
    {
      icon: <BookLock className="h-5 w-5" />,
      label: "Privacy Policy",
      href: "/privacy-policy",
    },
    {
      icon: <HelpCircle className="h-5 w-5" />,
      label: "Help",
      href: "/how-it-works",
    },
    ...(user
      ? [
          {
            icon: <LogOut className="h-5 w-5" />,
            label: "Logout",
            onclick: () => handleLogout(),
          },
        ]
      : []),
  ];

  // const user = true;
  // const menu = [
  //   ...(user ? ["Profile"] : ["Login"]),
  //   "Cart",
  //   "Help"
  // ];
  // console.log(menu);// ["Profile", "Cart", "Help"]
  // without ...  ==>
  // [
  //   ["Profile"],   // ❗ nested array
  //   "Cart",
  //   "Help"
  // ]
  // [...["Profile"], "Cart"]; ==> ["Profile","Cart"]

  // menu have two types of items
  // item with href  : No extra logic, just a page change
  // item with onclick : Can do multiple things: checks user then navigate

  const DisplayMenuItems = ({ className = "" }) => (

    <div className={className}>

      {menuItems?.map((item, index) =>

        item?.href ? (

          <Link
            key={index}
            href={item.href}
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200"
          >
            {item?.icon}
            <span>{item?.label}</span>

            {item?.content && <div className="">{item?.content}</div>}

            <ChevronRight className="w-4 h-4 ml-auto" />
          </Link>

        ) : (
          // handleLoginClick , handleLogout , handleProtectionNavigation
          <button
            key={index}
            onClick={item?.onclick}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200 cursor-pointer"
          >
            {item?.icon}
            <span>{item?.label}</span>

            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        )

      )}

    </div>

  );

  return (

    <header className="border-b bg-white sticky top-0  z-70">

      {/* if no container then full width always and if 
      max-width:auto with container then horizontally center */}
      {/* container : gives the div a responsive max-width. */}
      {/* container mx-auto : Screen/viewport is 650px  then ==> 5px  640px  5px */}
      {/* again full width on 768px and in 770px ==> 1px 768px 1 px */}
      {/* but mx-auto dont have any visible effect at 640 and 768 exactly */}


      {/* desktop header starts */}
      <div className="container hidden lg:flex items-center justify-between p-4">
     
        {/* logo start */}

        <Link href={"/"} className="flex items-center">
          <Image
            src={"/images/book.png"}
            alt="logo"
            width={450}
            height={100}
            className="h-14 w-auto"
          />
          {/* If you don't use className, the image will show at 450 × 100 px. */}
          {/* aspect ratio is width divided by height : 450 / 100 = 4.5 */}
          {/* Width = Height × Aspect Ratio */}
          {/* h-14 is 3.5rem and 3.5rem x 16px = 56px and Width = 56 × 4.5 = 252px */}
     
        </Link>
        {/* logo ends */}

        {/* xs sm md lg xl 2xl : max-w-xl => 576px */}

        {/* search starts*/}
        <div className="flex-1 max-w-md px-4 ">

          {/* flex-1 says "grow into available space", while max-w-md says "but don't become wider than 448px." */}
          {/* [Logo]   ==> [Search Bar] <==   [Sell Used Book / Account / Cart] ====> thats why flex-1 : fills the remaining space*/}

          <div className="relative">

            {/*  */}
            <Input
              type="text"
              onChange={(e) => {
                setSearchTerms(e.target.value);
              }}
              value={searchTerms}
              className="pr-10 border border-r-0 focus-visible:outline-none  focus:outline-none focus:ring-0 focus-visible:ring-0"
              placeholder="Book Name | Author | Publisher | Subject"
            />
            {/* Not all elements have an outline by default.
                only input , button and link tag but you can put on div */}
            
            {/* you need border for border-r-0 */}
            {/* try focus:border-transparent etc */}

        

            <Button
              onClick={handleSearch}
              size={"icon"} //The button becomes square and small, designed for icons only, equal width and height , small padding
              variant={"ghost"} //No background (transparent) , No border , light background appears on hover otherwise black (default) in shadcn/ui.
              className="absolute bg-amber-100 -right-[30px] cursor-pointer"
            >
              <SearchIcon className="w-5! h-5!" />
              {/* ! = important → overrides internal styles */}

            </Button>

          </div>

        </div>
        {/* search ends */}

        {/* [Sell Used Book / Account / Cart] starts*/}

        <div className="flex items-center gap-4 ">

          {/*sell button starts*/}
          <Link href={"/book-sell"}>
            <Button
              variant={"secondary"} // light gray background
              className="bg-yellow-300 text-gray-700 hover:bg-yellow-500 cursor-pointer"
            >
              Sell Used Book
            </Button>
            {/* if we don’t use a Button component, you usually need to write more CSS in link */}
          </Link>
          {/*sell  button ends*/}

          {/*my account  starts*/}

          <DropdownMenu  open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>

            <DropdownMenuTrigger asChild>
              {/* asChild : “Don’t create your own button — use my child as the trigger” */}
              {/* DropdownMenuTrigger is also button , Button inside button (invalid HTML) , 
             Causes focus, outline, click glitches  */}

              <Button
                variant={"ghost"} // no border and transparent
                className="focus:outline-none focus:ring-0 focus-visible:ring-0 cursor-pointer"        
              >

                <Avatar className="w-8 h-8 ">

                  {user?.profilePicture ? (

                    <AvatarImage
                      src={user?.profilePicture}
                      alt="user_image"
                    ></AvatarImage>

                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className="ml-2 mt-2" />
                  )}
        
                </Avatar>

                My Account

              </Button>

            </DropdownMenuTrigger>

            
            <DropdownMenuContent className="mt-5 hidden lg:block">
              <DisplayMenuItems />
            </DropdownMenuContent>

          </DropdownMenu>

          {/*my account ends */}

          {/* cart starts */}

          <Link href={"/checkout/cart"}>

            <div className="relative">


              <Button variant={"ghost"} className="relative cursor-pointer ">
                <ShoppingCart className="h-5 w-5 mr-2" />

                Cart
              </Button>

              {user && cartItemCount > 0 && (
                <span
                  className="absolute top-2 left-5  translate-x-1/2 -translate-y-1/2 bg-red-500
                text-white rounded-full px-1 text-xs"
                >
                  {/* -translate-y-1/2 :  Move the element 50% of its own height upward from its original position. */}
                  {cartItemCount}
                </span>
              )}
              
            </div>

          </Link>
          {/* cart ends */}

        </div>
        {/* [Sell Used Book / Account / Cart] ends*/}

      </div>
      {/* desktop header ends */}

      {/* mobile header starts =====================================>*/}

      {/* sheet , logo , search , cart */}
      <div className=" flex lg:hidden items-center justify-between p-4">

        {/*Sheet : slide-over panel, often used for modals, menus etc */}

        <Sheet>

          <SheetTrigger asChild>
            
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="h-5 w-6" />
            </Button>

          </SheetTrigger>

          {/* content */}
          <SheetContent side="left" className="w-80 p-0 mt-17">
            <DisplayMenuItems />
          </SheetContent>
          {/* content */}
          
        </Sheet>

        {/* sheet ends */}
        
        {/*  */}
        {/* logo */}

        <Link href={"/"} className="flex items-center">
          <Image
            src={"/images/book.png"}
            alt="logo"
            width={450}
            height={100}
            className="h-7 md:h-10 w-auto min-w-7"
          />
        </Link>

        {/* logo ends */}
        {/*  */}

        {/* search */}

        <div className="flex flex-1  items-center justify-center max-w-xl px-4">

          <div className="relative w-full">

            <Input
              type="text"
              value={searchTerms}
              onChange={(e) => setSearchTerms(e.target.value)}
              className="w-full pr-10 min-w-[160px]"
              placeholder="Search Books..."
            />

            <Button
              onClick={handleSearch}
              size={"icon"}
              variant={"ghost"}
              className="absolute right-0 top-0.4 cursor-pointer hover:bg-amber-300 bg-amber-200"
            >
              <SearchIcon className="w-5 h-5" />
            </Button>

          </div>

        </div>

        {/* search ends*/}

        {/* cart starts */}
        <Link href={"/checkout/cart"}>

          <div className="relative">

            <Button variant={"ghost"} className="relative">
              <ShoppingCart className="h-5 w-5 mr-2" />
            </Button>

            {user && cartItemCount > 0 && (
              <span
                className="absolute top-2 left-5 translate translate-x-1/2 -translate-y-1/2 bg-red-500
                text-white rounded-full px-1 text-xs"
              >
                {cartItemCount}
              </span>
            )}

          </div>

        </Link>
        {/* cart ends */}

        {/*  */}
      </div>

      {/* mobile header ends*/}

      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />

    </header>
  );
};

export default Header;
