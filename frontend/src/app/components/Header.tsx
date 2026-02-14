"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { toggleLoginDialog } from "@/store/slice/userSlice";
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

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoginOpen = useSelector(
    (state: RootState) => state.user.isLoginDialogOpen,
  );
  const user = {
    profilePicture: "",
    name: "raj",
    email: "raj@gmail.com",
  };
  // const user = "";
  const userPlaceholder = "ra";

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
    setIsDropdownOpen(false);
  };
  const handleLogout = () => {};

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
    ...(user && [
      {
        icon: <LogOut className="h-5 w-5" />,
        label: "Logout",
        onclick: () => handleLogout,
      },
    ]),
  ];

  const DisplayMenuItems = ({ className = "" }) => (
    <div className={className}>
      {menuItems?.map((item, index) =>
        item?.href ? (
          <Link
            key={index}
            href={item.href}
            onClick={() => setIsDropdownOpen(false)}
            className="flex items-center gap-3 px-4 py-3 text-sm bg-yellow-100  rounded-lg hover:bg-gray-200"
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
            className="w-full flex items-center gap-3 px-4 py-3 text-sm bg-green-200 rounded-lg hover:bg-gray-200"
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
      {/* desktop header */}
      <div className="container   w-[80%] mx-auto hidden lg:flex items-center justify-between p-4">
        {/* logo */}
        <Link href={"/"} className="flex items-center">
          <Image
            src={"/images/book.png"}
            alt="logo"
            width={450}
            height={100}
            className="h-15 w-auto"
          />
        </Link>
        {/* logo ends */}

        {/* search */}
        <div className="flex flex-1  items-center justify-center max-w-xl px-4">
          <div className="relative w-full">
            <Input
              type="text"
              // onChange={() => {}}
              value={""}
              className="w-full pr-10 outline-none focus-outline:none focus:ring-0 focus-visible:ring-0"
              placeholder="Book name | Author | Publisher | Subject"
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
        {/* search */}

        {/* sell button, my account */}
        <div className="flex items-center gap-4">
          <Link href={"/book-self"}>
            <Button
              variant={"secondary"}
              className="bg-yellow-400 text-gray-700 hover:bg-yellow-500"
            >
              Sell Used Book
            </Button>
          </Link>
          {/* dropdown */}
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant={"ghost"}>
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
            <DropdownMenuContent className="">
              <DisplayMenuItems />
            </DropdownMenuContent>
          </DropdownMenu>
          {/* dropdown ends */}
          {/* cart starts */}
          <Link href={"/checkout/cart"}>
            <div className="relative">
              <Button variant={"ghost"} className="relative">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Cart
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
        </div>
      </div>

      {/* desktop header */}

      {/* mobile starts*/}

      <div className="container mx-auto flex lg:hidden items-center justify-between p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <Menu className="h-5 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader>
              <SheetTitle className="sr-only"></SheetTitle>
            </SheetHeader>
            <div className="border-b p-4">
              <Link href={"/"}>
                <Image
                  src={"/images/book.png"}
                  alt="logo"
                  width={150}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>
            <DisplayMenuItems className="py-2" />
          </SheetContent>
        </Sheet>
        {/*  */}
        {/* logo */}
        <Link href={"/"} className="flex items-center">
          <Image
            src={"/images/book.png"}
            alt="logo"
            width={450}
            height={100}
            className="h-6 md:h-10 w-20 md:w-auto"
          />
        </Link>
        {/* logo ends */}

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
        {/* search */}

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

      {/* mobile ends*/}
    </header>
  );
};

export default Header;
