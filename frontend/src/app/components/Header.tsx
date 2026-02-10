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
  BookLock,
  ChevronRight,
  FileTerminal,
  Heart,
  HelpCircle,
  Lock,
  LogOut,
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
import { useDispatch } from "react-redux";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();
  const user = {
    profilePicture: "",
    name: "",
    email: "",
  };
  const userPlaceholder = "";

  const handleLoginClick = () => {};
  const handleLogout = () => {};

  const handleProtectionNavigation = (href: string) => {
    if (user) {
      // router.push(href)
      setIsDropdownOpen(false);
    }
  };

  const menuItems = [
    ...(user && user
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
            icon: <User className="h-5 w-5" />,
            label: "My Profile",
            onclick: () => handleProtectionNavigation("/account/profile"),
          },
        ]),

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
            className="flex items-center gap-3 px-4 py-3 text-sm  rounded-lg hover:bg-gray-200"
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
            className="w-full flex items-center gap-3 px-4 py-3 text-sm  rounded-lg hover:bg-gray-200"
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
    <header className="border-b  sticky top-0 z-50">
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
              className="w-full pr-10"
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
        </div>
      </div>

      {/* desktop header */}
    </header>
  );
};

export default Header;
