"use client";
import React, { useEffect } from "react";

import confetti from "canvas-confetti";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetOrderByIdQuery } from "@/store/api";
import BookLoader from "@/lib/BookLoader";
import { motion } from "framer-motion";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();

  const { orderId } = useSelector((state: RootState) => state.checkout);
  const { data: orderData, isLoading } = useGetOrderByIdQuery(orderId || "");

  useEffect(() => {
    if (!orderId) {
      router.push("/checkout/cart");
    } else {
      confetti({
        particleCount: 100,
        spread: 140,
        origin: { y: 0.6 },
      });
    }
  }, []);

  if (isLoading) {
    return <BookLoader />;
  }
  if (!orderId || !orderData) {
    return null;
  }
  const { totalAmount, items, status, createdAt } = orderData.data;

  // 576 → 672 → 768 → 896 → 1024 → 1152 → 1280
  // xl    2xl   3xl   4xl   5xl    6xl     7xl  Each step adds ~96px

  // xs    sm    md   lg    xl     2xl ..... 7xl
  // 320   384   448  512   576   ...........
  return (
    <div
      className="min-h-screen bg-linear-to-br from-purple-400
  via-pink-500 to-red-500 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* opacity 1 : normal look */}
        {/* animate = target and transition = style of movement */}
        <Card className="shadow-2xl bg-white bg-opacity-90 backdrop-blur-sm">
          <CardHeader className="text-center border-b border-gray-200 pb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 500 }}
              // spring : bounce like , stiffness = moves fast and stops quickly , 100 : slow spring
              className="w-full max-w-4xl"
            >
              <CheckCircle />
            </motion.div>
            <CardTitle></CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </div>
  );
};

export default page;
