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
import { logout, toggleLoginDialog } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
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
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthPage from "./AuthPage";
import { useLogoutMutation } from "@/store/api";
import toast from "react-hot-toast";

const Header = () => {
  const[logoutMutation]=useLogoutMutation()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen,
  );
  // const user = {
  //   profilePicture: "",
  //   name: "raj",
  //   email: "raj@gmail.com",
  // };
  // const user = "";
  const user = useSelector((state: RootState) => state.user.user);
  console.log(user)

  const userPlaceholder = user?.name?.split(" ").map((name:string)=>name[0]).join("");

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };
  const handleLogout = async() => {
    try {
      await logoutMutation({}).unwrap()
      dispatch(logout())
      toast.success("Logout done.")
      setIsDropdownOpen(false)
      
    } catch (error) {
      toast.error("Failed to logout.")
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

  const menuItems = [
    ...(user
      ? [
          {
            href: "account/profile",
            content: (
              <div className="flex space-x-4 items-center p-2 border-b">
                <Avatar className="w-12 h-12 -ml-2 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage alt="user_image"></AvatarImage>
                  ) : (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-semibold text-md">{user?.name}</span>

                  <span className="text-xs text-gray-500">{user?.email}</span>
                </div>
              </div>
            ),
          },
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
      onclick: () => handleProtectionNavigation("account/wishlist"),
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
    ...(user && user
      ? [
          {
            icon: <LogOut className="h-5 w-5" />,
            label: "Logout",
            onclick: () => handleLogout(),
          },
        ]
      : []),
  ];

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
            {item?.content && <div className="mt-1">{item?.content}</div>}
            <ChevronRight className="w-4 h-4 ml-auto" />
          </Link>
        ) : (
          <button
            key={index}
            onClick={item?.onclick}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-gray-200"
          >
            {item?.icon}
            <span>{item?.label}</span>

            <ChevronRight className="w-4 h-4 ml-auto" />
          </button>
        ),
      )}
    </div>
  );

  return (
    <header className="border-b bg-white sticky top-0 z-70">
      {/* container : If the screen width is 2000px, in Tailwind CSS the container will not become 2000px. */}
      {/* It stops at the largest breakpoint : 1536px */}
      {/* Yes — container already has mx-auto behavior, so adding mx-auto is usually redundant. */}
      {/* m	margin , x	left + right , auto	automatic margin ==> It centers a block element horizontally inside its parent.*/}

      {/* desktop contents starts */}
      <div className="container hidden lg:flex items-center justify-between p-4">
        {/* logo : buy books */}
        <Link href={"/"} className="flex items-center">
          <Image
            src={"/images/book.png"}
            alt="logo"
            width={450}
            height={100}
            className="h-14 w-auto"
          />
          {/* If you don't use className, the image will show at 450 × 100 px. */}
          {/* 450 / 100 = 4.5 , width = height × ratio ==> width = 56 × 4.5 = 256px */}
          {/* w-auto makes the browser calculate width automatically using the image ratio. */}
        </Link>
        {/* logo ends */}

        {/* [Logo]   [Search Bar]   [Buttons / Cart / Account] ====> thats why flex-1 : fills the remaining space*/}
        {/* xs sm md lg xl 2xl : max-w-xl => 36rem / 576px */}
        {/* search starts*/}
        <div className="flex-1 max-w-xl px-4 ">
          <div className="relative">
            <Input
              type="text"
              // onChange={() => {}}
              value={""}
              className="pr-5 border border-r-0   outline-none focus:outline-none focus:ring-0 focus-visible:ring-0"
              placeholder="Book name | Author | Publisher | Subject"
            />
            {/* Ring doesn’t technically remove the outline, but it usually covers it visually.
            Use focus:outline-none if you want the ring only. 
            Tailwind’s ring visually overwrites the native browser outline*/}
            <Button
              size={"icon"} //The button becomes square and small, designed for icons only, equal width and height , small padding
              variant={"ghost"} //No background , No border , light background appears on hover otherwise black (default) in shadcn/ui.
              className="absolute bg-amber-100 right-px"
            >
              <SearchIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
        {/* search ends */}

        {/* sell used book button , my account dropdown and cart*/}
        <div className="flex items-center gap-4">
          {/*sell button starts*/}
          <Link href={"/book-self"}>
            <Button
              variant={"secondary"} // light gray background
              className="bg-yellow-400 text-gray-700 hover:bg-yellow-500"
            >
              Sell Used Book
            </Button>
            {/* if we don’t use a Button component, you usually need to write more CSS in link */}
          </Link>
          {/*sell  button ends*/}

          {/*my account dropdown starts*/}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              {/* So your button will not show outline after dropdown closes. */}
              <Button
                variant={"ghost"}
                className="outline-none focus:outline-none focus:ring-0 focus-visible:ring-0"
              >
                <Avatar className="w-8 h-8 rounded-full">
                  {user?.profilePicture ? (
                    <AvatarImage alt="user_image"></AvatarImage>
                  ) : userPlaceholder ? (
                    <AvatarFallback>{userPlaceholder}</AvatarFallback>
                  ) : (
                    <User className="ml-2 mt-2" />
                  )}
                </Avatar>
                My Account
              </Button>
            </DropdownMenuTrigger>

            {/* content starts */}
            <DropdownMenuContent className="mt-5">
              <DisplayMenuItems />
            </DropdownMenuContent>
            {/* content ends */}
          </DropdownMenu>
          {/* 
             asChild example:
            <Button asChild>
             <a href="/login">Login</a>
            </Button>
            Here, the <Button> will NOT render a <button> tag.
            Instead, it passes its styles and behavior to the child element.
            So the <a> becomes the button-styled element.
          */}

          {/*my account  dropdown ends */}

          {/* cart starts */}
          <Link href={"/checkout/cart"}>
            <div className="relative">
              {user && (
                <span
                  className="absolute top-1 left-5 translate translate-x-1/2 -translate-y-1/2 bg-red-500
                text-white rounded-full px-1 text-xs"
                >
                  {/*
                   <div class="h-40 -translate-y-1/2"></div>
                   -translate-y-1/2 = move up 50% of 40px (move up from bottom)
                  "of its own height” means the movement is based on the element’s own size
                  */}
                  {/* In Tailwind v3+ no need translate */}8
                </span>
              )}
              <Button variant={"ghost"} className="relative ">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
              </Button>
            </div>
          </Link>
          {/* cart ends */}
        </div>
        {/* sell used book button , my account and cart ends*/}
      </div>
      {/* desktop contents ends */}

      {/* mobile header/contents starts*/}
      {/* sheet , logo , search , cart */}
      <div className="container mx-auto flex lg:hidden items-center justify-between p-4">
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
            className="h-7 md:h-10 w-auto"
          />
        </Link>
        {/* logo ends */}
        {/*  */}

        {/* search */}
        <div className="flex flex-1  items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              // onChange={() => {}}
              value={""}
              className="w-full pr-10"
              placeholder="Search Books..."
            />
            <Button
              size={"icon"}
              variant={"ghost"}
              className="absolute right-0 top-0.4"
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
              {/* Cart */}
            </Button>
            {user && (
              <span
                className="absolute top-2 left-5 translate translate-x-1/2 -translate-y-1/2 bg-red-500
                text-white rounded-full px-1 text-xs"
              >
                8
              </span>
            )}
          </div>
        </Link>
        {/* cart ends */}

        {/*  */}
      </div>
      {/* mobile header/contents ends*/}
      <AuthPage isLoginOpen={isLoginOpen} setIsLoginOpen={handleLoginClick} />
    </header>
  );
};

export default Header;
