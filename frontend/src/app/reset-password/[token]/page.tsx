"use client";
import { useResetPasswordMutation } from "@/store/api";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { CheckCircle, Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLoginDialog } from "@/store/slice/userSlice";

interface ResetPasswordFormData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

const page: React.FC = () => {
  const [resetPassword] = useResetPasswordMutation();
  const [resetPasswordSuccess, setResetPasswordSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      setResetPasswordLoading(false)
      return;
    }
    try {
      setResetPasswordLoading(true);
      await resetPassword({
        token: token,
        newPassword: data.newPassword,
      }).unwrap();
      setResetPasswordSuccess(true);

      toast.success("Password reset done");
    } catch (error) {
      toast.error("Failed to rest the password");
    } finally {
      setResetPasswordLoading(false);
    }
  };

  const handleLoginClick = () => {
    dispatch(toggleLoginDialog());
  };

  return (
    <div className="p-20 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
      <motion.div
        // className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl font-semibold text-gray-700 mb-6 text-center">
          reset your password
        </h2>
        {!resetPasswordSuccess ? (
          <div>
            <form className="space-y-4 " onSubmit={handleSubmit(onSubmit)}>
              <div className="relative">
                <Input
                  {...register("newPassword", {
                    required: "New Password is Required",
                  })}
                  placeholder="New Password"
                  type={showPassword ? "text" : "password"}
                  className="pl-10"
                />

                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
                {showPassword ? (
                  <EyeOff
                    onClick={() => setShowPassword(false)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    size={20}
                  />
                ) : (
                  <Eye
                    onClick={() => setShowPassword(true)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"
                    size={20}
                  />
                )}
              </div>
              {errors.newPassword && (
                <p className="text-red-500 text-sm">
                  {errors.newPassword.message}
                </p>
              )}
              {/* confirm password */}
              <Input
                {...register("confirmPassword", {
                  required: "Confirm Password is Required",
                })}
                placeholder="Confirm Password"
                type={"password"}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </form>
            {/* button */}
            <Button
              type="submit"
              className="w-full font-bold bg-blue-600 hover:bg-blue-500 text-white py-2 px-2 rounded-md transition
             duration-300 ease-in-out transform hover:scale-105"
            >
              {resetPasswordLoading ? (
                <Loader2 className="animate-spin mr-2" size={20} />
              ) : (
                "Reset Password"
              )}
            </Button>
          </div>
        ) : (
          <motion.div
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Password Reset successfully
            </h2>
            <p className="text-gray-500">
              Your password has been reset successfully. You can now log in with
              new password.
            </p>
            <Button
              className="bg-blue-500 mt-4 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition
                         duration-300 ease-in-out transform hover:scale-105"
              onClick={handleLoginClick}
            >
              Go to Login
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default page;
