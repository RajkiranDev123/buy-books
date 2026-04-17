"use client";
import React, { useEffect, useState } from "react";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddToWishlistMutation,
  useCreateOrUpdateOrderMutation,
  useCreateRazorpayPaymentMutation,
  useGetCartQuery,
  useGetOrderByIdQuery,
  useRemoveFromCartMutation,
  useRemoveFromWishlistMutation,
} from "@/store/api";
import {
  addToWishlistAction,
  removeFromWishListAction,
} from "@/store/slice/wishlistSlice";
import toast from "react-hot-toast";
import { clearCart, setCart } from "@/store/slice/cartSlice";
import NoData from "@/app/components/NoData";
import { toggleLoginDialog } from "@/store/slice/userSlice";
import { ChevronRight, CreditCard, MapPin, ShoppingCart } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CartItems from "@/app/components/CartItems";
import PriceDetails from "@/app/components/PriceDetails";
import { Address } from "@/lib/types/type";
import {
  resetCheckout,
  setCheckoutStep,
  setOrderId,
} from "@/store/slice/checkoutSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CheckoutAddress from "@/app/components/CheckoutAddress";
import BookLoader from "@/lib/BookLoader";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const { orderId, step } = useSelector((state: RootState) => state.checkout);
  const wishlist = useSelector((state: RootState) => state.wishlist.items);
  const cart = useSelector((state: RootState) => state.cart);
  const [showAddressDialog, setShowAddressDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(
    user?._id,
  );

  const [createOrUpdateOrder] = useCreateOrUpdateOrderMutation();
  const { data: orderData, isLoading: isOrderLoading } = useGetOrderByIdQuery(
    orderId || "",
  );

  const [createRazorPayPayment] = useCreateRazorpayPaymentMutation();
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (orderData && orderData.shippingAddress) {
      setSelectedAddress(orderData.shippingAddress);
    }
  }, [orderData]);

  useEffect(() => {
    if (step === "address" && !selectedAddress) {
      setShowAddressDialog(true);
    }
  }, [step, selectedAddress]);

  const [removeCartMutation] = useRemoveFromCartMutation();
  const [addWishlistMutation] = useAddToWishlistMutation();
  const [removeWishlistMutation] = useRemoveFromWishlistMutation();

  useEffect(() => {
    if (cartData?.success && cartData?.data) {
      dispatch(setCart(cartData.data));
    }
  }, [cartData, dispatch]);

  const handleRemoveItem = async (productId: string) => {
    try {
      const result = await removeCartMutation(productId).unwrap();
      if (result.success) {
        dispatch(setCart(result.data));
        // dispatch(resetCheckout())
        toast.success(result.message || "Item removed successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to remove item from cart");
    }
  };

  const handleAddToWishList = async (productId: string) => {
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
      } else {
        const result = await addWishlistMutation(productId).unwrap();

        if (result.success) {
          dispatch(addToWishlistAction(result.data));
          toast.success(result.message || "Added to wishlist");
        } else {
          throw new Error(result.message || "Failed to remove from wishlist");
        }
      }
    } catch (error: any) {
      const errormessage = error?.data?.message;
      toast.error(errormessage || "Failed to add/remove wishlist");
    }
  };

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
  };

  const totalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.finalPrice * item.quantity,
    0,
  );
  const totalOriginalAmount = cart.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0,
  );
  const totalDiscount = totalOriginalAmount - totalAmount;

  const shippingCharge = cart.items.map((item) =>
    item.product.shippingCharge.toLowerCase() === "Free"
      ? 0
      : parseFloat(item.product.shippingCharge) || 0,
  );

  const maximumShippingCharge = Math.max(...shippingCharge, 0);
  const finalAmount = totalAmount - maximumShippingCharge;

  const handleProceedToCheckout = async () => {
    if (step === "cart") {
      try {
     

        const result = await createOrUpdateOrder({
          updates: {  totalAmount: totalAmount },
        }).unwrap();

        if (result.success) {
          toast.success("Order created successfully");
          dispatch(setOrderId(result.data._id));
          dispatch(setCheckoutStep("address"));
        } else {
          throw new Error(result.message);
        }
      } catch (error) {
        toast.error("Failed to create order");
      }
    } else if (step === "address") {
      if (selectedAddress) {
        dispatch(setCheckoutStep("payment"));
      } else {
        setShowAddressDialog(true);
      }
    } else if (step === "payment") {
      handlePayment();
    }
  };

  const handlePayment = async () => {
    if (!orderId) {
      toast.error("No rorder id found ");
      return;
    }
    setIsProcessing(true);
    try {
      const { data, error } = await createRazorPayPayment(orderId);
      if (error) {
        throw new Error("failed to create razor pay order");
      }
      const razorpayOrder = data.data.order;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "buy books",
        description: "Book Purchase",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            const result = await createOrUpdateOrder({
              updates: {
                orderId,
                paymentDetails: {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              },
            }).unwrap();

            if (result.success) {
              dispatch(clearCart());
              dispatch(resetCheckout());
              toast.success("Paymenr done");
              router.push(`/checkout/payment-success?orderId=${orderId}`);
            } else {
              throw new Error(result.message);
            }
          } catch (error) {
            console.log(error);
            toast.error("Payment done but failed to update order");
          }
        },
        prefill: {
          name: orderData?.data.user?.name,
          email: orderData?.data.user?.email,
          contact: orderData?.data.user?.phoneNumber,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error("failed to initiate payment. plz try againm");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSelectAddress = async (address: Address) => {
    setSelectedAddress(address);
    setShowAddressDialog(false);
    if (orderId) {
      try {
        await createOrUpdateOrder({
          updates: { orderId, shippingAddress: address },
        }).unwrap();
        toast.success("address updated successfully");
      } catch (error) {
        toast.error("failed to update address");
      }
    }
  };

  if (!user) {
    return (
      <NoData
        message="Please Login to access your cart"
        description="You need to be loggged in to view your cart"
        ButtonText="Login"
        imageUrl="/images/login.jpg"
        onClick={handleLoginClick}
      />
    );
  }

  if (cart.items.length === 0) {
    return (
      <NoData
        message="Your Cart is empty"
        description="Looks like you have not added any items yet. Explore our collection and find something you love"
        ButtonText="Browse Books"
        imageUrl="/images/cart.webp"
        onClick={() => router.push("/books")}
      />
    );
  }

  if (isCartLoading || isOrderLoading) {
    return <BookLoader />;
  }

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <div className="min-h-screen bg-white">
        <div className="bg-gray-100 py-4 px-6 mb-8">
          <div className="container mx-auto flex items-center">
            <ShoppingCart className="h-6 w-6 mr-2 text-gray-600" />
            <span className="text-lg font-semibold text-gray-600">
              {cart.items.length} {cart.items.length === 1 ? "item" : "items"}
              in your cart
            </span>
          </div>
        </div>
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <div className="flex justify-center items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "cart" ? "bg-blue-600 text-gray-200" : "bg-gray-200 text-gray-600"}`}
                >
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <span className="font-medium hidden md:inline">Cart</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />
              {/*  */}
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "address" ? "bg-blue-600 text-gray-200" : "bg-gray-200 text-gray-600"}`}
                >
                  <MapPin className="h-6 w-6" />
                </div>
                <span className="font-medium hidden md:inline">Address</span>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400" />

              {/*  */}

              {/*  */}
              <div className="flex items-center gap-2">
                <div
                  className={`rounded-full p-3 ${step === "payment" ? "bg-blue-600 text-gray-200" : "bg-gray-200 text-gray-600"}`}
                >
                  <CreditCard className="h-6 w-6" />
                </div>
                <span className="font-medium hidden md:inline">Payment</span>
              </div>

              {/*  */}
            </div>
          </div>
          {/*  */}
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card className="shadow-lg ">
                <CardHeader>
                  <CardTitle className="text-2xl">Order Summary</CardTitle>
                  <CardDescription>Review your items</CardDescription>
                </CardHeader>
                <CardContent>
                  <CartItems
                    items={cart.items}
                    onRemoveItem={handleRemoveItem}
                    onToggleWishlist={handleAddToWishList}
                    wishlist={wishlist}
                  />
                </CardContent>
              </Card>
            </div>
            {/*  */}
            <div>
              <PriceDetails
                totalOriginalAmount={totalOriginalAmount}
                totalAmount={finalAmount}
                shippingCharge={maximumShippingCharge}
                totalDiscount={totalDiscount}
                itemCount={cart.items.length}
                isProcessing={isProcessing}
                step={step}
                onProceed={handleProceedToCheckout}
                onBack={() =>
                  dispatch(
                    setCheckoutStep(step === "address" ? "cart" : "address"),
                  )
                }
              />
              {/* address */}

              {selectedAddress && (
                <Card className="mt-6 mb-6 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-xl">Delivery Address</CardTitle>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-1">
                      <p>{selectedAddress?.addressLine1}</p>
                      {selectedAddress?.addressLine2 && (
                        <p>{selectedAddress?.addressLine2}</p>
                      )}

                      <p>
                        {selectedAddress.city} , {selectedAddress?.state}{" "}
                        {selectedAddress?.pincode}
                      </p>

                      <p>Phone : {selectedAddress?.phoneNumber}</p>
                    </div>
                    <Button
                      className="mt-4"
                      variant={"outline"}
                      onClick={() => setShowAddressDialog(true)}
                    >
                      <MapPin className="mr-2 w-4 h-4" /> Change Address
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* address */}
            </div>

            {/*  */}
          </div>

          {/* dialog */}

          <Dialog open={showAddressDialog} onOpenChange={setShowAddressDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Select or Add Delivery Address</DialogTitle>
              </DialogHeader>
              <CheckoutAddress
                onAddressSelect={handleSelectAddress}
                selectedAddressId={selectedAddress?._id}
              />
            </DialogContent>
          </Dialog>

          {/* dialog */}

          {/*  */}
        </div>
      </div>
    </>
  );
};

export default page;
