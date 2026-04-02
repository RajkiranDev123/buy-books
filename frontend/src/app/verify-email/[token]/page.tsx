"use client";
import { useVerifyEmailMutation } from "@/store/api";
import { authStatus, setEmailVerified } from "@/store/slice/userSlice";
import { RootState } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const page: React.FC = () => {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  const dispatch = useDispatch();
  const [verifyEmail] = useVerifyEmailMutation();
  const isVerifyEmail = useSelector(
    (state: RootState) => state.user.isEmailVerified,
  );
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "success" | "alreadyVerified" | "Failed"
  >("loading");

  useEffect(() => {
    const verify = async () => {
      if (isVerifyEmail) {
        setVerificationStatus("alreadyVerified");
        return;
      }
      try {
        const result = await verifyEmail(token).unwrap();
        if (result.success) {
          dispatch(setEmailVerified(true));
          setVerificationStatus("success");
          dispatch(authStatus());
          toast.success("Email verified successfully");
          setTimeout(() => {
            window.location.href = "/";
          }, 3000);
        } else {
          throw new Error(result.message || "Verification failed");
        }
      } catch (error) {
        toast.error("Failed to verify your email");
      }
    };
    if (token) {
      verify();
    }
  }, [token, verifyEmail, dispatch, isVerifyEmail]);
  return (
    <div className="p-20 flex items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
      <motion.div
        // className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {verificationStatus === "loading" && (
          <div className="flex flex-col items-center ">
            <Loader2 className="h-16 w-16 text-blue-500 animate-spin mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Verifying your email...
            </h2>
            <p className="text-gray-500">
              Please wait while we confirm your email address...
            </p>
          </div>
        )}
        {verificationStatus === "success" && (
          <motion.div
            // className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Email Verified
            </h2>
            <p className="text-gray-500">
              Your email has been successfully verified. You will be redirecting
              to the homepage sortly.
            </p>
          </motion.div>
        )}
        {verificationStatus === "alreadyVerified" && (
          <motion.div
            // className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md w-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
          >
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Email Already Verified
            </h2>
            <p className="text-gray-500">
              Your email is already verified. You can use our services.
            </p>
            <Button className="bg-blue-500 mt-4 hover:bg-blue-600 text-white font-bold py-2 rounded-full transition
             duration-300 ease-in-out transform hover:scale-105" onClick={() => router.push("/")}>Go to Homepage</Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default page;
