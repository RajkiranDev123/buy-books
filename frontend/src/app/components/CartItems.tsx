import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItem } from "@/lib/types/type";
import { Heart, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CartItemsProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onToggleWishlist: (productId: string) => void;
  wishlist: { products: string[] }[];
}
// “wishlist is an array of objects”
// [
//   { products: ["p1", "p2"] },
//   { products: ["p3"] }
// ]
const CartItems: React.FC<CartItemsProps> = ({
  items,
  onRemoveItem,
  onToggleWishlist,
  wishlist,
}) => {
  console.log(55, items);
  return (
    <ScrollArea>
      {items.map((item) => (
        <div
          key={item._id}
          className="flex flex-col md:flex-row gap-4 py-4 border-b last:border-0 "
        >
          <Link href={`/books/${item.product._id}`}>
            <Image
              src={item?.product?.images?.[0]}
              alt="img"
              width={80}
              height={100}
              className="object-contain w-60 md:40 rounded-xl"
            />
          </Link>
          {/* right */}
          <div className="flex-1">
            <h3 className="font-medium">{item.product.title}</h3>
            <div className="mt-1 text-sm text-gray-500">
              Quantity : {item.quantity}
            </div>
            <div className="mt-1 font-medium">
              <span className="mr-2 line-through text-gray-500">
                Rs {item.product.price}
              </span>
              Rs {item.product.finalPrice}
            </div>
            <div className="mt-1 text-sm text-green-600">
              {item.product.shippingCharge === "free"
                ? "Free shipping"
                : `Shipping Rs ${item.product.shippingCharge}`}
            </div>
            <div className="mt-2 flex gap-2">
              <Button
                className="w-[100px] md:w-[200px]"
                variant={"outline"}
                size={"sm"}
                onClick={() => onRemoveItem(item.product._id)}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                <span className="hidden md:inline">Remove</span>
              </Button>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => onToggleWishlist(item.product._id)}
              >
                <Heart
                  className={`h-4 w-4 mr-1 ${wishlist.some((w) => w.products.includes(item.product._id)) ? "fill-red-500" : ""}`}
                />
                <span className="hidden md:inline">
                  {wishlist.some((w) => w.products.includes(item.product._id))
                    ? "Remove from wishlist"
                    : "Add to wishlist"}
                </span>
              </Button>
            </div>
          </div>
          {/*  */}
        </div>
      ))}
    </ScrollArea>
  );
};

export default CartItems;
