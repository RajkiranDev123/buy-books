"use client"
import { useLogoutMutation } from "@/store/api";
import { logout } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { BookOpen, Heart, ShoppingCart, User } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const navigation = [
  {
    title: "My Profile",
    href: "/account/profile",
    icon: User,
    color: "from-pink-500 to-rose-500",
  },
  {
    title: "My Orders",
    href: "/account/orders",
    icon: ShoppingCart,
    color: "from-orange-500 to-amber-500",
  },
  {
    title: "Selling Products",
    href: "/account/selling-products",
    icon: BookOpen,
    color: "from-green-500 to-emerald-500",
  },
  {
    title: "Wishlist",
    href: "/account/wishlist",
    icon: Heart,
    color: "from-red-500 to-pink-500",
  },
];

const layout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  const [logoutMutation] = useLogoutMutation();
  const userPlaceholder = user?.name
    ?.split(" ")
    .map((name: string) => name[0])
    .join("");

  const handleLogout = async () => {
    try {
      await logoutMutation({}).unwrap();
      dispatch(logout());
      toast.success("user logged out");
      router.push("/");
    } catch (error) {
      toast.error("failed to logout");
    }
  };

  

  return <div>{children}</div>;
};

export default layout;
