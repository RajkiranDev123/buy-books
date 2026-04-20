"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserData } from "@/lib/types/type";
import { useUpdateUserMutation } from "@/store/api";
import { setUser } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { Mail, Phone, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

const page = () => {
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();

  const user = useSelector((state: RootState) => state.user.user);
  console.log(556, user?._id);

  const [updateUser, { isLoading }] = useUpdateUserMutation();

  const { register, handleSubmit, reset } = useForm<UserData>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });

  //   👉 defaultValues = initial
  // 👉 reset = update later

  useEffect(() => {
    reset({
      name: user?.name || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber || "",
    });
  }, [user, isEditing, reset]);

  const handleProfileEdit = async (data: UserData) => {
    try {
      const { name, email, phoneNumber } = data;
      const result = await updateUser({
        userId: user?._id,
        userData: {
          name,
          phoneNumber,
        },
      });
      if (result?.data?.data) {
        dispatch(setUser(result.data.data));
        setIsEditing(false);
        toast.success("profile updated");
      } else {
        throw new Error("could not update profile");
      }
    } catch (error) {
      toast.error("failed to updatew profile");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-linear-to-r from-pink-500 to-rose-500 text-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold mb-2">My Profile</h1>
        <p className="text-pink-100">
          Manage your personal information and references
        </p>
      </div>
      <Card className="border-t-4 border-t-pink-500 shadow-lg">
        <CardHeader className="bg-linear-to-r fron-pink-50 to-rose-50">
          <CardTitle className="text-2xl text-pink-700 ">
            Personal Information
          </CardTitle>
          <CardDescription>
            Update your profile details and contact information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          <form onSubmit={handleSubmit(handleProfileEdit)}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="username"></Label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="username"
                    placeholder="john"
                    disabled={!isEditing}
                    className="pl-10"
                    {...register("name")}
                  />
                </div>
              </div>
              {/*  */}
              <div className="space-y-2">
                <Label htmlFor="email"></Label>

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="email"
                    placeholder="john@"
                    disabled={!isEditing || isEditing}
                    className="pl-10"
                    // {...register("email")}
                  />
                </div>
              </div>

              {/*  */}
              {/*  */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>

                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    placeholder="6002080805"
                    disabled={!isEditing}
                    className="pl-10"
                    {...register("phoneNumber")}
                  />
                </div>
              </div>

              {/*  */}
            </div>
            <CardFooter className="mt-4 bg-pink-50 flex justify-between">
              {isEditing ? (
                <>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="mt-4"
                  >
                    Discard Changes
                  </Button>
                  <Button
                    type="submit"
                    variant={"outline"}
                    disabled={isLoading}
                    className="bg-linear-to-r from-pink-500 to-rose-500 text-white"
                  >
                    {isLoading ? "saving..." : "save changes"}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={() => setIsEditing(true)}
                    className="bg-linear-to-r mt-4 from-pink-500 to-rose-500 text-white"
                  >
                    Edit Profile
                  </Button>
                </>
              )}
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
