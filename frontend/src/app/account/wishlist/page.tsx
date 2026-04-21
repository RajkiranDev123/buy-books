"use client";
import NoData from "@/app/components/NoData";
import BookLoader from "@/lib/BookLoader";
import { BookDetails } from "@/lib/types/type";
import {
  useAddToCartMutation,
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import { addToCart } from "@/store/slice/cartSlice";
import { removeFromWishListAction } from "@/store/slice/wishlistSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [addToCartMutation] = useAddToCartMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();
  const [isAddToCart, setIsAddToCart] = useState(false);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart.items);

  const { data: wishlistData, isLoading } = useGetWishlistQuery({});

  const [wishlistItems, setWishlistItems] = useState<BookDetails[]>([]);
  useEffect(() => {
    if (wishlistData?.success) {
      setWishlistItems(wishlistData?.data?.products);
    }
  }, [wishlistData]);

  const handleAddToCart = async (productId: string) => {
    setIsAddToCart(true);
    try {
      const result = await addToCartMutation({
        productId,
        quantity: 1,
      }).unwrap();
      if (result.success || result.data) {
        dispatch(addToCart(result.data));
        toast.success(result.message || "Added to cart ");
      } else {
        throw new Error(result.message || "Failed to add to cart");
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      toast.error(errormessage);
    } finally {
      setIsAddToCart(false);
    }
  };

  const toggleWishList = async (productId: string) => {
    try {
      const isWishlist = wishlist.some((item) =>
        item.products.includes(productId),
      );
      console.log("wlkjhgf", wishlist);
      if (isWishlist) {
        const result = await removeWishlistMutation(productId).unwrap();
        if (result.success) {
          dispatch(removeFromWishListAction(productId));
          toast.success(result.message || "Removed from wishlist");
        } else {
          throw new Error(result.message || "Failed to remove from wishlist");
        }
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      toast.error(errormessage || "Failed to remove wishlist");
    }
  };

  const isItemInCart = (productId: string) => {
    return cart.some((cartItem) => cartItem.product._id === productId);
  };

  if (isLoading) {
    return <BookLoader />;
  }

  if (!wishlistItems.length) {
    return (
      <NoData
        message="your wish lost is empty"
        description="looks like you have not added any items to your wishlist yet
      browse your collection and save your favourites"
        ButtonText="browse books"
        imageUrl="/images/wishlist.webp"
        onClick={() => router.push("/books")}
      />
    );
  }

  return <div className="space-y-6">

    <div className="space-x-2 flex items-center">

    </div>
    

  </div>;
};

export default page;
