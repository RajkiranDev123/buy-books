import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Lock, SearchIcon, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Header = () => {
  const user = {
    profilePicture: "",
    name: "",
    email: "",
  };
  const userPlaceholder = "";

  const handleLoginClick = () => {};

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
            icon: <Lock className="h-5 w-5" />,
            label: "Login/Signup",
            onclick: handleLoginClick,
          },
        ]),

    {
      icon: <Lock className="h-5 w-5" />,
      label: "Login/Signup",
      onclick: handleLoginClick,
    },
    {
      icon: <Lock className="h-5 w-5" />,
      label: "Login/Signup",
      onclick: handleLoginClick,
    },
    {
      icon: <Lock className="h-5 w-5" />,
      label: "Login/Signup",
      onclick: handleLoginClick,
    },
    {
      icon: <Lock className="h-5 w-5" />,
      label: "Login/Signup",
      onclick: handleLoginClick,
    },
  ];
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

          <DropdownMenu>
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
            <DropdownMenuContent>jhg</DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* desktop header */}
    </header>
  );
};

export default Header;
