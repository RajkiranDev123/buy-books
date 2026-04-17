import { Address } from "@/lib/types/type";
import { useAddOrUpdateAddressMutation, useGetAddressQuery } from "@/store/api";
import React, { useState } from "react";
import * as zod from "zod";
import {  useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import BookLoader from "@/lib/BookLoader";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface CheckoutAddressProps {
  onAddressSelect: (address: Address) => void;
  selectedAddressId?: string;
}

interface AddressResponse {
  success: boolean;
  message: string;
  data: {
    addresses: Address[];
  };
}

const addressFormSchema = zod.object({
  phoneNumber: zod.string().min(10, "Phone number must be 10 digits"),
  addressLine1: zod
    .string()
    .min(5, "Address line 1 must be atleast 5 characters"),
  addressLine2: zod.string().optional(),
  city: zod.string().min(2, "City atleast 2 characters"),
  state: zod.string().min(2, "State atleast 2 characters"),
  pincode: zod.string().min(6, "Pincode must be 6 digits"),
});

type AddressFormValues = zod.infer<typeof addressFormSchema>;

const CheckoutAddress: React.FC<CheckoutAddressProps> = ({
  onAddressSelect,
  selectedAddressId,
}) => {
  const { data: addressData, isLoading } = useGetAddressQuery() as {
    data: AddressResponse | undefined;
    isLoading: boolean;
  };

  const [addOrUpdateAddress] = useAddOrUpdateAddressMutation();
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const addresses = addressData?.data?.addresses || [];

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      phoneNumber: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      state: "",
      pincode: "",
    },
  });

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    form.reset(address);
    setShowAddressForm(true);
  };

  const onSubmit = async (data: AddressFormValues) => {
    try {
      let result;
      if (editingAddress) {
        const updateAddress = {
          ...editingAddress,
          ...data,
          addressId: editingAddress._id,
        };
        result = await addOrUpdateAddress(updateAddress).unwrap();
      } else {
        result = await addOrUpdateAddress(data).unwrap();
      }
      setShowAddressForm(false);
      setEditingAddress(null);
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return <BookLoader />;
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-6 mb-6">
        {addresses.map((address: Address) => (
          <Card
            key={address._id}
            className={`relative overflow-hidden rounded-lg border transition-all
          duration-300 
          ${
            selectedAddressId === address._id
              ? "border-blue-500 shadow-lg"
              : " border-gray-200 shadow-md hover:shadow-lg"
          }`}
          >
            <CardContent className="p-6 space-y-4 ">
              <div className="flex items-center justify-between">
                <Checkbox
                  checked={selectedAddressId === address._id}
                  onCheckedChange={() => onAddressSelect(address)}
                  className="w-5 h-5"
                />
                <div className="flex items-center justify-between">
                  <Button
                    size={"icon"}
                    variant={"ghost"}
                    onClick={() => handleEditAddress(address)}
                  >
                    <Pencil className="h-5 w-5 text-gray-600 hover:text-blue-500" />
                  </Button>
                </div>
              </div>
              {/*  */}
              <div className="text-sm text-gray-600">
                <p>{address?.addressLine1}</p>
                {address?.addressLine2 && <p>{address?.addressLine2}</p>}

                <p>
                  {address.city} , {address?.state} {address?.pincode}
                </p>

                <p className="mt-2 font-medium">
                  Phone : {address?.phoneNumber}
                </p>
              </div>

              {/*  */}
            </CardContent>
          </Card>
        ))}
      </div>
      {/*  */}

      <Dialog open={showAddressForm} onOpenChange={setShowAddressForm}>
        <DialogTrigger asChild>
          <Button className="w-full" variant={"outline"}>
            <Plus className="mr-2 h-4 w-4" />{" "}
            {editingAddress ? "Edit address" : "Add new address"}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "Edit address" : "Add new address"}
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter 10 digits mobile no"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
              />
              {/*  */}
              <FormField
                name="addressLine1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 1</FormLabel>
                    <FormControl>
                      <Input placeholder="Street , House No" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
              />

              {/*  */}
              {/*  */}
              <FormField
                name="addressLine2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address Line 2 (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Appartment , suite , unit , etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
              />

              {/*  */}

              {/*  */}
              <div className="grid grid-cols-2">
                <FormField
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                />

                <FormField
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                  control={form.control}
                />
              </div>

              {/*  */}

              <FormField
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pincode</FormLabel>
                    <FormControl>
                      <Input placeholder="Pincode" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                control={form.control}
              />

              {/*  */}

              {/*  */}

              {/*  */}

              <Button type="submit" className="w-full">
                {editingAddress ? "update adddress" : "Add adress"}
              </Button>

              {/*  */}
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/*  */}
    </div>
  );
};

export default CheckoutAddress;
